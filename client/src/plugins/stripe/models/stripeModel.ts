export interface StripeApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface StripeResourceItem {
  id: string;
  object?: string;
  name?: string;
  email?: string;
  status?: string;
  active?: boolean;
  amount?: number;
  unit_amount?: number;
  currency?: string;
  interval?: string;
  url?: string;
  created?: number;
  metadata?: Record<string, string>;
  [key: string]: any;
}

export interface StripeDashboardSummary {
  products: number;
  prices: number;
  paymentLinks: number;
  customers: number;
  activeSubscriptions: number;
  pastDueSubscriptions: number;
  failedPayments: number;
  totalRevenue: number;
  currency: string;
}

export interface StripeDashboardModel {
  summary: StripeDashboardSummary;
  recentPayments: StripeResourceItem[];
  recentInvoices: StripeResourceItem[];
  subscriptionsNeedingAttention: StripeResourceItem[];
}

export interface StripeProductFormModel {
  name: string;
  description?: string;
  membershipTier?: string;
  skuName?: string;
  skuId?: string;
}

export interface StripePriceFormModel {
  productId: string;
  nickname: string;
  amount: number;
  currency: string;
  interval: string;
  membershipTier?: string;
  skuName?: string;
  skuId?: string;
}

export interface StripePaymentLinkFormModel {
  priceId: string;
  quantity: number;
  membershipTier?: string;
  skuName?: string;
  skuId?: string;
}
