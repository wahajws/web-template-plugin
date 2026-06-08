'use strict';

const StripeClientService = require('./stripe-client-service');

const withClient = async (callback) => {
  const client = await StripeClientService.getClient();
  return await callback(client);
};

const stripeMetadata = (data = {}) => {
  return {
    plugin: 'stripe',
    membership_tier: data.membershipTier || data.nickname || data.name || '',
    sku_name: data.skuName || data.sku_name || '',
    sku_id: data.skuId || data.sku_id || '',
  };
};

const normalizeInvoice = (invoice) => {
  const customer = invoice.customer && typeof invoice.customer === 'object'
    ? invoice.customer
    : null;

  return {
    ...invoice,
    invoiceNumber: invoice.number || invoice.id,
    customerName: invoice.customer_name || customer?.name || '-',
    customerEmail: invoice.customer_email || customer?.email || '-',
    customerId: customer?.id || invoice.customer || null,
    hostedInvoiceUrl: invoice.hosted_invoice_url,
    invoicePdf: invoice.invoice_pdf,
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    amountRemaining: invoice.amount_remaining,
    createdDate: invoice.created,
    dueDate: invoice.due_date,
    periodStart: invoice.period_start,
    periodEnd: invoice.period_end,
    subscriptionId: typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription?.id || null,
  };
};

module.exports = {
  products: {
    list: () => withClient(({ stripe }) => stripe.products.list({ limit: 100, active: true })),
    create: (data) => withClient(({ stripe }) => stripe.products.create({
      name: data.name,
      description: data.description,
      metadata: stripeMetadata(data),
    })),
  },

  prices: {
    list: () => withClient(({ stripe }) => stripe.prices.list({
      limit: 100,
      active: true,
      expand: ['data.product'],
    })),
    create: (data) => withClient(({ stripe, config }) => {
      const priceData = {
        product: data.productId,
        currency: (data.currency || config.currency).toLowerCase(),
        unit_amount: Number(data.amount),
        nickname: data.nickname,
        metadata: stripeMetadata(data),
      };

      if (data.interval && data.interval !== 'one_time') {
        priceData.recurring = {
          interval: data.interval,
        };
      }

      return stripe.prices.create(priceData);
    }),
  },

  paymentLinks: {
    list: () => withClient(({ stripe }) => stripe.paymentLinks.list({ limit: 100 })),
    create: (data) => withClient(({ stripe }) => stripe.paymentLinks.create({
      line_items: [
        {
          price: data.priceId,
          quantity: Number(data.quantity || 1),
        },
      ],
      metadata: stripeMetadata(data),
    })),
  },

  customers: {
    list: () => withClient(({ stripe }) => stripe.customers.list({ limit: 100 })),
  },

  subscriptions: {
    list: () => withClient(({ stripe }) => stripe.subscriptions.list({
      limit: 100,
      status: 'all',
      expand: ['data.customer', 'data.latest_invoice'],
    })),
  },

  invoices: {
    list: () => withClient(async ({ stripe }) => {
      const invoices = await stripe.invoices.list({
        limit: 100,
        expand: ['data.customer', 'data.subscription'],
      });

      return {
        ...invoices,
        data: invoices.data.map(normalizeInvoice),
      };
    }),
  },

  payments: {
    list: () => withClient(({ stripe }) => stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.customer', 'data.invoice'],
    })),
  },
};
