'use strict';

const BasePluginController = require('../../../app/plugins/base-plugin-controller');
const StripeService = require('../services/stripe-service');

class StripeController extends BasePluginController {
  constructor() {
    super(StripeService);
  }

  connection = this.action('connection');
  dashboard = this.action('dashboard');
  webhook = this.action('webhook');

  products = this.list('products');
  createProduct = this.create('products');

  prices = this.list('prices');
  createPrice = this.create('prices');

  paymentLinks = this.list('paymentLinks');
  createPaymentLink = this.create('paymentLinks');

  customers = this.list('customers');
  subscriptions = this.list('subscriptions');
  invoices = this.list('invoices');
  payments = this.list('payments');
}

module.exports = new StripeController();
