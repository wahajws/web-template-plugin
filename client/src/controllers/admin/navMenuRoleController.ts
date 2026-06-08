import  NavMenuRoleService  from '@/services/navMenuRoleService';
import { BaseController } from '@/controllers/baseController';

export default new class NavMenuRoleController extends BaseController {
  constructor() {
    super(NavMenuRoleService);
  };
}