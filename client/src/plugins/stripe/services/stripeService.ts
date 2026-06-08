import { BasePluginService } from '@/plugins/_shared/basePluginService';
import { StripePriceFormModel } from '../models/stripeModel';

class StripeService extends BasePluginService {
  constructor() {
    super('/admin/plugins/stripe');
  }

  async createPrice(data: StripePriceFormModel) {
    return await this.create('prices', {
      ...data,
      amount: Math.round(Number(data.amount) * 100),
    });
  }
}

export default new StripeService();
