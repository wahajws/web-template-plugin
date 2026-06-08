import  SystemRoleService  from '@/services/systemRoleService';
import { BaseController } from '@/controllers/baseController';

export default new class SystemRoleController extends BaseController {
  constructor() {
    super(SystemRoleService);
  };
}