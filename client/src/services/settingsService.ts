import { BaseService } from './helpers/baseService';
import { SettingsFormModel, SettingsModel } from '@/models/settingsModel';

export default new class SettingsService extends BaseService {

  constructor() {
      super({
        getAllUrl: '/admin/settings/getAll',
        getByIdUrl:'/admin/settings/getById',
        createUrl: '/admin/settings/create',
        updateUrl: '/admin/settings/update',
        deleteUrl: '/admin/settings/delete'
    })
  }

  async getById(id: number): Promise<SettingsModel> {
    const settings = await super.getById(id);
    return this.parseSettingValue(settings);
  }

  async update(id: number, data: SettingsFormModel): Promise<SettingsModel> {
    const settings = await super.update(id, {
      ...data,
      settingValue: JSON.stringify(data.settingValue),
    });

    return this.parseSettingValue(settings);
  }

  async getByKey(datakey: string){
    try {
      const response = await this.get(`/admin/settings/getByKey/` + datakey);
      const result = Array.isArray(response) ? response: [];
      return result;
    } 
    catch (error) {
      console.error('Error fetching static data:', error);
      throw error;
    }      
  }

  private parseSettingValue(settings: SettingsModel): SettingsModel {
    return {
      ...settings,
      settingValue: typeof settings.settingValue === 'string'
        ? JSON.parse(settings.settingValue)
        : settings.settingValue,
    };
  }
}
