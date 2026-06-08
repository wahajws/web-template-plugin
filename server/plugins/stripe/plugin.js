'use strict';

const stripeRoute = require('./routes/stripe-route');
const PluginManagerService = require('../../app/plugins/plugin-manager-service');

const requireInstalled = (req, res, next) => {
  if (!PluginManagerService.isInstalled('stripe')) {
    return res.status(404).json({
      errors: {
        msg: 'PLUGIN_NOT_INSTALLED',
      },
    });
  }

  next();
};

module.exports = {
  name: 'stripe',
  label: 'Stripe Management',
  description: 'Manage Stripe memberships, payment links, customers, subscriptions, invoices, and revenue from the admin console.',
  register: ({ router }) => {
    router.use('/admin/plugins/stripe', requireInstalled, stripeRoute);
  },
};
