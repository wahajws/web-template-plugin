'use strict';

const { sequelize } = require('../../../config/database');
const { Op } = require('sequelize');

class StripeConfigService {
  async getSettingsRecord() {
    const Settings = sequelize.models.Settings;

    if (!Settings) {
      throw new Error('Settings model not loaded');
    }

    const record = await Settings.findOne({
      where: {
        settingKey: {
          [Op.in]: ['stripe', 'pg_stripe', 'bg_stripe'],
        },
      },
      order: [['settingKey', 'ASC']],
    });

    if (!record) {
      throw new Error('Stripe settings not found. Add a stripe or pg_stripe settings record first.');
    }

    return JSON.parse(JSON.stringify(record));
  }

  async getConfig() {
    const record = await this.getSettingsRecord();
    const settingValue = typeof record.settingValue === 'string'
      ? JSON.parse(record.settingValue)
      : record.settingValue;

    const stripeConfig = settingValue.stripe || settingValue.Stripe || settingValue.pg_stripe || settingValue;
    const mode = stripeConfig.mode || 'test';
    const modeConfig = stripeConfig[mode] || stripeConfig;
    const modeKeys = modeConfig.keys || {};
    const secretKey =
      modeConfig.secret_key ||
      modeConfig.secretKey ||
      modeConfig.sk_key ||
      modeKeys.secret_key ||
      modeKeys.secretKey ||
      modeKeys.sk_key ||
      stripeConfig.secret_key ||
      stripeConfig.secretKey ||
      stripeConfig.sk_key;
    const publishableKey =
      modeConfig.publishable_key ||
      modeConfig.publishableKey ||
      modeConfig.pk_key ||
      modeKeys.publishable_key ||
      modeKeys.publishableKey ||
      modeKeys.pk_key ||
      stripeConfig.publishable_key ||
      stripeConfig.publishableKey ||
      stripeConfig.pk_key;
    const webhookSecret = modeConfig.webhook_secret || modeConfig.webhookSecret || stripeConfig.webhook_secret || stripeConfig.webhookSecret;

    if (!secretKey) {
      throw new Error('Stripe secret key is missing in settings');
    }

    return {
      enabled: stripeConfig.enabled !== false && stripeConfig.active !== false,
      mode,
      currency: (stripeConfig.currency || 'usd').toLowerCase(),
      successUrl: stripeConfig.success_url || stripeConfig.successUrl || 'http://localhost:3001/payment/success',
      cancelUrl: stripeConfig.cancel_url || stripeConfig.cancelUrl || 'http://localhost:3001/payment/cancel',
      publishableKey,
      secretKey,
      webhookSecret,
    };
  }
}

module.exports = new StripeConfigService();
