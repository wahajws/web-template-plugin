'use strict';

const Stripe = require('stripe');
const StripeConfigService = require('./stripe-config-service');

class StripeClientService {
  async getClient() {
    const config = await StripeConfigService.getConfig();

    return {
      config,
      stripe: new Stripe(config.secretKey),
    };
  }

  maskKey(key) {
    if (!key || key.length < 12) {
      return key;
    }

    return `${key.slice(0, 7)}...${key.slice(-4)}`;
  }
}

module.exports = new StripeClientService();
