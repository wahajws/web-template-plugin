import { BaseService } from './helpers/baseService'
import { httpService } from './helpers/http'

export default new class NavigationMenuService extends BaseService {

  constructor() {
      super({
        getAllUrl: '/admin/nav-menu/getAll',
        getByIdUrl:'/admin/nav-menu/getById',
        createUrl: '/admin/nav-menu/create',
        updateUrl: '/admin/nav-menu/update',
        deleteUrl: '/admin/nav-menu/delete'
    })
  }

  // Custom method to get all navigation menus with full response
  async getAuthorised() {
    const userData = localStorage.getItem('user_data');
    
    if(!userData) {
      console.log('No user data found in localStorage. Returning empty dataset.'); // Debug log
      return { success: false, data: [] };
    }

    const response = await httpService.post('/admin/nav-menu/getAuthorised', JSON.parse(userData));
    // Since httpService.get already extracts response.data, we need to return it as-is
    // The API returns {success: true, data: [...]}, so response is already the data array
    return JSON.parse(JSON.stringify(response));
  }

  // Bulk update navigation menus
  async bulkUpdate(data: Array<{id: number, parentId: number, orderIndex: number}>) {
    return await httpService.put('/admin/nav-menu/bulk-update', data);
  }
} 
