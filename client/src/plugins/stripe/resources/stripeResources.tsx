import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { CreditCard, ExternalLink, FileText, Link, Receipt, RefreshCcw, Users } from 'lucide-react';
import { PluginResourcePageConfig } from '@/plugins/_shared/PluginResourcePage';
import { StripeResourceItem } from '../models/stripeModel';

const formatStripeDate = (value?: number) => {
  if (!value) {
    return '-';
  }

  return new Date(value * 1000).toLocaleDateString();
};

const formatStripeDateTime = (value?: number) => {
  if (!value) {
    return '-';
  }

  return new Date(value * 1000).toLocaleString();
};

const statusBadge = (value: any, activeValue = 'active') => (
  <Badge variant={value === activeValue || value === true ? 'default' : value === 'past_due' ? 'destructive' : 'secondary'}>
    {typeof value === 'boolean' ? value ? 'Active' : 'Inactive' : value || '-'}
  </Badge>
);

const getMetadataValue = (row: StripeResourceItem, key: string) => {
  return row.metadata?.[key]
    || row.price?.metadata?.[key]
    || row.product?.metadata?.[key]
    || row.items?.data?.[0]?.price?.metadata?.[key]
    || row.lines?.data?.[0]?.price?.metadata?.[key]
    || row.lines?.data?.[0]?.metadata?.[key]
    || '-';
};

const skuColumns = [
  {
    key: 'metadata',
    label: 'SKU Name',
    render: (_: any, row: StripeResourceItem) => getMetadataValue(row, 'sku_name'),
  },
  {
    key: 'metadata',
    label: 'SKU ID',
    render: (_: any, row: StripeResourceItem) => getMetadataValue(row, 'sku_id'),
  },
];

export const stripeResourceConfigs: Record<string, PluginResourcePageConfig<StripeResourceItem>> = {
  prices: {
    title: 'Membership Tiers',
    description: 'Manage Stripe products and recurring prices.',
    resource: 'prices',
    icon: CreditCard,
    createPath: '/admin/plugins/stripe/memberships/create',
    columns: [
      {
        key: 'nickname',
        label: 'Membership',
        render: (value, row) => (
          <div>
            <div className="font-medium">{value || row.product?.name || row.id}</div>
            <div className="text-sm text-muted-foreground">{row.id}</div>
          </div>
        ),
      },
      {
        key: 'unit_amount',
        label: 'Price',
        render: (value, row) => formatCurrency((Number(value) || 0) / 100, row.currency || 'usd'),
      },
      ...skuColumns,
      {
        key: 'recurring',
        label: 'Billing',
        render: (_, row) => row.recurring?.interval || 'one time',
      },
      {
        key: 'active',
        label: 'Status',
        render: (value) => statusBadge(value),
      },
    ],
  },

  paymentLinks: {
    title: 'Stripe Links',
    description: 'Create and test hosted Stripe payment links.',
    resource: 'payment-links',
    icon: Link,
    createPath: '/admin/plugins/stripe/payment-links/create',
    actions: (row) => row.url ? (
      <Button variant="outline" size="sm" asChild>
        <a href={row.url} target="_blank" rel="noreferrer">
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    ) : null,
    columns: [
      { key: 'id', label: 'Payment Link' },
      ...skuColumns,
      {
        key: 'active',
        label: 'Status',
        render: (value) => statusBadge(value),
      },
      {
        key: 'url',
        label: 'URL',
        render: (value) => value ? (
          <a className="text-primary underline" href={value} target="_blank" rel="noreferrer">
            Open link
          </a>
        ) : '-',
      },
      {
        key: 'created',
        label: 'Created',
        render: (value) => formatStripeDate(value),
      },
    ],
  },

  customers: {
    title: 'Stripe Customers',
    description: 'View customer billing records and metadata.',
    resource: 'customers',
    icon: Users,
    columns: [
      {
        key: 'email',
        label: 'Customer',
        render: (value, row) => (
          <div>
            <div className="font-medium">{row.name || value || row.id}</div>
            <div className="text-sm text-muted-foreground">{value || row.id}</div>
          </div>
        ),
      },
      { key: 'id', label: 'Stripe ID' },
      ...skuColumns,
      {
        key: 'created',
        label: 'Created',
        render: (value) => formatStripeDate(value),
      },
    ],
  },

  subscriptions: {
    title: 'Subscriptions',
    description: 'Monitor active, trialing, canceled, and past due memberships.',
    resource: 'subscriptions',
    icon: RefreshCcw,
    columns: [
      {
        key: 'id',
        label: 'Subscription',
        render: (value, row) => (
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.customer?.email || row.customer?.id || '-'}</div>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (value) => statusBadge(value),
      },
      ...skuColumns,
      {
        key: 'current_period_end',
        label: 'Next Payment',
        render: (value) => formatStripeDate(value),
      },
    ],
  },

  invoices: {
    title: 'Invoices',
    description: 'Review invoices, payment status, and billing health.',
    resource: 'invoices',
    icon: Receipt,
    columns: [
      {
        key: 'invoiceNumber',
        label: 'Invoice',
        render: (value, row) => (
          <div>
            <div className="font-medium">{value || row.id}</div>
            <div className="text-sm text-muted-foreground">{row.id}</div>
          </div>
        ),
      },
      {
        key: 'customerName',
        label: 'Customer',
        render: (value, row) => (
          <div>
            <div className="font-medium">{value || '-'}</div>
            <div className="text-sm text-muted-foreground">{row.customerEmail || '-'}</div>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (value) => statusBadge(value, 'paid'),
      },
      ...skuColumns,
      {
        key: 'amountPaid',
        label: 'Paid',
        render: (value, row) => formatCurrency((Number(value) || 0) / 100, row.currency || 'usd'),
      },
      {
        key: 'amountDue',
        label: 'Due',
        render: (value, row) => formatCurrency((Number(value) || 0) / 100, row.currency || 'usd'),
      },
      {
        key: 'amountRemaining',
        label: 'Remaining',
        render: (value, row) => formatCurrency((Number(value) || 0) / 100, row.currency || 'usd'),
      },
      {
        key: 'createdDate',
        label: 'Created',
        render: (value) => formatStripeDateTime(value),
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        render: (value) => formatStripeDate(value),
      },
    ],
    actions: (row) => (
      <div className="flex items-center space-x-2">
        {row.hostedInvoiceUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={row.hostedInvoiceUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        {row.invoicePdf && (
          <Button variant="outline" size="sm" asChild>
            <a href={row.invoicePdf} target="_blank" rel="noreferrer">
              <FileText className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    ),
  },
};
