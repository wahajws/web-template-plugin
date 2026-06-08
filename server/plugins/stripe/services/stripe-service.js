'use strict';

const BasePluginService = require('../../../app/plugins/base-plugin-service');
const StripeClientService = require('./stripe-client-service');
const stripeResources = require('./stripe-resource-map');

class StripeService extends BasePluginService {
  constructor() {
    super(stripeResources);
  }

  async connection() {
    const { stripe, config } = await StripeClientService.getClient();
    const account = await stripe.accounts.retrieve();

    return {
      mode: config.mode,
      currency: config.currency,
      publishableKey: config.publishableKey ? StripeClientService.maskKey(config.publishableKey) : null,
      account: {
        id: account.id,
        email: account.email,
        country: account.country,
        defaultCurrency: account.default_currency,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
      },
    };
  }

  async dashboard() {
    const [products, prices, paymentLinks, customers, subscriptions, invoices, payments] = await Promise.all([
      this.list('products'),
      this.list('prices'),
      this.list('paymentLinks'),
      this.list('customers'),
      this.list('subscriptions'),
      this.list('invoices'),
      this.list('payments'),
    ]);

    const successfulPayments = payments.data.filter((payment) => payment.status === 'succeeded');
    const failedPayments = payments.data.filter((payment) => payment.status !== 'succeeded');
    const activeSubscriptions = subscriptions.data.filter((subscription) => subscription.status === 'active');
    const pastDueSubscriptions = subscriptions.data.filter((subscription) => ['past_due', 'unpaid'].includes(subscription.status));
    const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      summary: {
        products: products.data.length,
        prices: prices.data.length,
        paymentLinks: paymentLinks.data.length,
        customers: customers.data.length,
        activeSubscriptions: activeSubscriptions.length,
        pastDueSubscriptions: pastDueSubscriptions.length,
        failedPayments: failedPayments.length,
        totalRevenue,
        currency: successfulPayments[0]?.currency || 'usd',
      },
      recentPayments: payments.data.slice(0, 10),
      recentInvoices: invoices.data.slice(0, 10),
      subscriptionsNeedingAttention: pastDueSubscriptions.slice(0, 10),
    };
  }

  async webhook(event) {
    return {
      received: true,
      type: event.type,
      id: event.id,
    };
  }
}

module.exports = new StripeService();
