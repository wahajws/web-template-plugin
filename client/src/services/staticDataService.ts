import { BaseService } from './helpers/baseService';
import { StaticDataFormModel } from '@/models/staticDataModel';

export default new class StaticDataService extends BaseService {

  constructor() {
      super({
        getAllUrl: '/admin/static-data/getAll',
        getByIdUrl:'/admin/static-data/getById',
        createUrl: '/admin/static-data/create',
        updateUrl: '/admin/static-data/update',
        deleteUrl: '/admin/static-data/delete'
    })
  }

  async getByKey(datakey: string){
    try {
      const response = await this.get(`/admin/static-data/getByKey/` + datakey);
      const result = Array.isArray(response) ? response: [];
      return result;
    } 
    catch (error) {
      console.error('Error fetching static data:', error);
      throw error;
    }      
  }

  async getDefaultByKey(datakey: string){
    try {
      const staticData = await this.getByKey(datakey);
      const response = await staticData.find((d: StaticDataFormModel) => d.dataKey === datakey && d.isDefaultValue)?.dataValue;
      return response;
    } 
    catch (error) {
      console.error('Error fetching static data:', error);
      throw error;
    } 
  } 
}
