import { BaseService } from './helpers/baseService'

export default new class NavigationMenuRoleService extends BaseService {

  constructor() {
      super({
        getAllUrl: '/admin/nav-menu-role/getEnhanced',
        getByIdUrl:'/admin/nav-menu-role/getById',
        createUrl: '/admin/nav-menu-role/create',
        updateUrl: '/admin/nav-menu-role/update',
        deleteUrl: '/admin/nav-menu-role/delete'
    })
  }
} 

