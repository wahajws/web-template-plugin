import { BaseService } from './helpers/baseService'

export default new class SystemRoleService extends BaseService {

  constructor() {
      super({
        getAllUrl: '/admin/system-role/getAll',
        getByIdUrl:'/admin/system-role/getById',
        createUrl: '/admin/system-role/create',
        updateUrl: '/admin/system-role/update',
        deleteUrl: '/admin/system-role/delete'
    })
  }
} 

