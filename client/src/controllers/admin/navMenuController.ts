import  NavigationMenuService  from '@/services/navMenuService';
import { BaseController } from '@/controllers/baseController';

export default new class NavMenuController extends BaseController {
  constructor() {
    super(NavigationMenuService);
  };

  async getAuthorised(): Promise<any[]> {
    try {
      const dataSet = await NavigationMenuService.getAuthorised();
      return dataSet.data || [];

    } catch (error: any) {
      console.error('Controller error:', error);
      // showErrorToast('Failed to fetch data', error.message || 'Unable to load data');
      throw error;
    }
  }
}