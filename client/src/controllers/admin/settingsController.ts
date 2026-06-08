import  SettingsService  from '@/services/settingsService';
import { BaseController } from '@/controllers/baseController';

export default new class SettingsController extends BaseController {
  constructor() {
    super(SettingsService);
  };
}