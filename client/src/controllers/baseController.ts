import { showSuccessToast, showErrorToast } from '@/utils/toast';

export class BaseController {

  readonly service: any;  

  constructor(modelService: any) {
    this.service = modelService;
  };

  async getAll(): Promise<any[]> {
    try {
      const dataSet = await this.service.getAll();
      const result = Array.isArray(dataSet) ? dataSet : [];
      return result;
    } catch (error: any) {
      console.error('Controller error:', error);
      showErrorToast('Failed to fetch data', error.message || 'Unable to load data');
      throw error;
    }
  }

  async getById(id: number): Promise<any> {
    try {
      const dataSet = await this.service.getById(id);
      return dataSet;
    } catch (error: any) {
      showErrorToast('Failed to fetch data', error.message || 'Unable to load data');
      throw error;
    }
  }

  async create(userData: any): Promise<any> {
    try {
      const newUser = await this.service.create(userData);
      showSuccessToast('Record Created', 'Record has been successfully created');
      return newUser;
    } catch (error: any) {
      showErrorToast('Failed to create record', error.message || 'Unable to create record');
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any> {
    try {
      const dataSet = await this.service.update(id, data);
      showSuccessToast('Record Updated', 'Record has been successfully updated');
      return dataSet;
    } catch (error: any) {
      showErrorToast('Failed to update data', error.message || 'Unable to update data');
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.service.delete(id);
      showSuccessToast('Record Deleted', 'Record has been successfully deleted');
    } catch (error: any) {
      showErrorToast('Failed to delete record', error.message || 'Unable to delete record');
      throw error;
    }
  }
}