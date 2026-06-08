import { BaseService } from './helpers/baseService'

export default new class CompanyService extends BaseService {

  constructor() {
      super({
        getAllUrl: '/admin/company/getAll',
        getByIdUrl:'/admin/company/getById',
        createUrl: '/admin/company/create',
        updateUrl: '/admin/company/update',
        deleteUrl: '/admin/company/delete'
    })
  }
} 

