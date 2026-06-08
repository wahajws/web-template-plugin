import { httpService } from './helpers/http';
import { PluginManagementModel } from '@/models/pluginManagementModel';

class PluginManagementService {
  private readonly baseUrl = '/admin/plugins';

  async getAll(): Promise<PluginManagementModel[]> {
    const response = await httpService.get<{ success: boolean; data: PluginManagementModel[] }>(`${this.baseUrl}/getAll`);
    return response.data || [];
  }

  async install(name: string): Promise<PluginManagementModel> {
    const response = await httpService.post<{ success: boolean; data: PluginManagementModel }>(`${this.baseUrl}/install/${name}`);
    return response.data;
  }

  async uninstall(name: string): Promise<PluginManagementModel> {
    const response = await httpService.post<{ success: boolean; data: PluginManagementModel }>(`${this.baseUrl}/uninstall/${name}`);
    return response.data;
  }

  async delete(name: string): Promise<void> {
    await httpService.delete(`${this.baseUrl}/delete/${name}`, {
      data: {
        confirmName: name,
      },
    });
  }
}

export default new PluginManagementService();
