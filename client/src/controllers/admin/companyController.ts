import  CompanyService  from '@/services/company-service';
import { BaseController } from '@/controllers/baseController';

export default new class CompanyController extends BaseController {
  constructor() {
    super(CompanyService);
  };
}