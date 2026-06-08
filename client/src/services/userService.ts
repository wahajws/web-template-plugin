import { BaseService } from './helpers/baseService'

export default new class UserService extends BaseService {

  constructor() {
      super({
        getAllUrl: '/admin/user/getall',
        getByIdUrl:'/admin/user/getbyid',
        createUrl: '/admin/user/create',
        updateUrl: '/admin/user/update',
        deleteUrl: '/admin/user/delete',
    })
  }
  
}

