import  StaticDataService  from '@/services/staticDataService';
import { BaseController } from '@/controllers/baseController';

export default new class StaticDataController extends BaseController {
  constructor() {
    super(StaticDataService);
  };
}