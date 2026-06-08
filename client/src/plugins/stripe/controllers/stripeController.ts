import { BasePluginController } from '@/plugins/_shared/basePluginController';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import StripeService from '../services/stripeService';
import {
  StripePaymentLinkFormModel,
  StripePriceFormModel,
  StripeProductFormModel,
} from '../models/stripeModel';

class StripeController extends BasePluginController {
  constructor() {
    super(StripeService, 'Stripe');
  }

  async connection() {
    return await this.get('connection', {
      errorTitle: 'Stripe Connection Failed',
      errorMessage: 'Unable to connect to Stripe',
    });
  }

  async dashboard() {
    return await this.get('dashboard', {
      errorTitle: 'Stripe Dashboard Failed',
      errorMessage: 'Unable to load Stripe dashboard',
    });
  }

  async createProduct(data: StripeProductFormModel) {
    return await this.create('products', data, {
      successTitle: 'Product Created',
      successMessage: 'Stripe product has been created',
      errorTitle: 'Product Failed',
      errorMessage: 'Unable to create Stripe product',
    });
  }

  async createPrice(data: StripePriceFormModel) {
    try {
      const result = await StripeService.createPrice(data);
      showSuccessToast('Membership Created', 'Stripe membership price has been created');
      return result;
    } catch (error: any) {
      showErrorToast('Membership Failed', error.message || 'Unable to create Stripe membership');
      throw error;
    }
  }

  async createPaymentLink(data: StripePaymentLinkFormModel) {
    return await this.create('payment-links', data, {
      successTitle: 'Payment Link Created',
      successMessage: 'Stripe payment link has been created',
      errorTitle: 'Payment Link Failed',
      errorMessage: 'Unable to create Stripe payment link',
    });
  }
}

export default new StripeController();
