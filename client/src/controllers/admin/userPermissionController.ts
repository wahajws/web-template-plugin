import  UserPermissionService  from '@/services/userPermissionService';
import { BaseController } from '@/controllers/baseController';

export default new class UserPermissionController extends BaseController {
  constructor() {
    super(UserPermissionService);
  };

  async getEnhanced(): Promise<any[]> {
    try {
      const dataSet = await UserPermissionService.getAll();
      const result = Array.isArray(dataSet) ? dataSet : [];
      return result;
    } catch (error: any) {
      console.error('Controller error:', error);
      // showErrorToast('Failed to fetch data', error.message || 'Unable to load data');
      throw error;
    }
  }
}