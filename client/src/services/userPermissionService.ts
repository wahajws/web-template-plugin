import { BaseService } from './helpers/baseService'

export default new class UserPermissionService extends BaseService {

  constructor() {
      super({
        getAllUrl: '/admin/user-permission/getEnhanced',
        getByIdUrl:'/admin/user-permission/getById',
        createUrl: '/admin/user-permission/create',
        updateUrl: '/admin/user-permission/update',
        deleteUrl: '/admin/user-permission/delete'
    })
  }

  async getByUserId(userId: number){
    try {
      const response = await this.get(`/admin/user-permission/getbyuserid/` + userId);
      const result = Array.isArray(response) ? response: [];
      return result;
    } 
    catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }      
  }
}
