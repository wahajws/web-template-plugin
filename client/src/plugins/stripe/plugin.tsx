import { StripeDashboardPage } from './pages/StripeDashboardPage';
import { StripeResourcePage } from './pages/StripeResourcePage';
import { StripeMembershipCreatePage } from './pages/StripeMembershipCreatePage';
import { StripePaymentLinkCreatePage } from './pages/StripePaymentLinkCreatePage';

const basePath = '/admin/plugins/stripe';

export default {
  name: 'stripe',
  label: 'Stripe Management',
  navigation: [
    {
      menuId: 'plugin-stripe',
      menuText: 'Stripe',
      url: basePath,
      icon: 'CreditCard',
      parentId: null,
      orderIndex: 900,
      pluginName: 'stripe',
      isPluginRoot: true,
    },
    {
      menuId: 'plugin-stripe-dashboard',
      menuText: 'Dashboard',
      url: basePath,
      icon: 'LayoutDashboard',
      parentId: null,
      orderIndex: 901,
      pluginName: 'stripe',
    },
    {
      menuId: 'plugin-stripe-memberships',
      menuText: 'Membership Tiers',
      url: `${basePath}/memberships`,
      icon: 'BadgeDollarSign',
      parentId: null,
      orderIndex: 902,
      pluginName: 'stripe',
    },
    {
      menuId: 'plugin-stripe-payment-links',
      menuText: 'Stripe Links',
      url: `${basePath}/payment-links`,
      icon: 'Link',
      parentId: null,
      orderIndex: 903,
      pluginName: 'stripe',
    },
    {
      menuId: 'plugin-stripe-customers',
      menuText: 'Stripe Customers',
      url: `${basePath}/customers`,
      icon: 'Users',
      parentId: null,
      orderIndex: 904,
      pluginName: 'stripe',
    },
    {
      menuId: 'plugin-stripe-subscriptions',
      menuText: 'Subscriptions',
      url: `${basePath}/subscriptions`,
      icon: 'RefreshCcw',
      parentId: null,
      orderIndex: 905,
      pluginName: 'stripe',
    },
    {
      menuId: 'plugin-stripe-invoices',
      menuText: 'Invoices',
      url: `${basePath}/invoices`,
      icon: 'Receipt',
      parentId: null,
      orderIndex: 906,
      pluginName: 'stripe',
    },
  ],
  routes: [
    {
      path: 'plugins/stripe',
      element: <StripeDashboardPage />,
    },
    {
      path: 'plugins/stripe/memberships',
      element: <StripeResourcePage resourceKey="prices" />,
    },
    {
      path: 'plugins/stripe/memberships/create',
      element: <StripeMembershipCreatePage />,
    },
    {
      path: 'plugins/stripe/payment-links',
      element: <StripeResourcePage resourceKey="paymentLinks" />,
    },
    {
      path: 'plugins/stripe/payment-links/create',
      element: <StripePaymentLinkCreatePage />,
    },
    {
      path: 'plugins/stripe/customers',
      element: <StripeResourcePage resourceKey="customers" />,
    },
    {
      path: 'plugins/stripe/subscriptions',
      element: <StripeResourcePage resourceKey="subscriptions" />,
    },
    {
      path: 'plugins/stripe/invoices',
      element: <StripeResourcePage resourceKey="invoices" />,
    },
  ],
};
