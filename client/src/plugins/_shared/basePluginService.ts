import { httpService } from '@/services/helpers/http';

export interface PluginApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export class BasePluginService {
  readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T = any>(path: string): Promise<T> {
    const response = await httpService.get<PluginApiResponse<T>>(`${this.baseUrl}/${path}`);
    return response.data;
  }

  async list<T = any>(resource: string): Promise<T[]> {
    const response = await httpService.get<PluginApiResponse<{ data: T[] }>>(`${this.baseUrl}/${resource}`);
    return response.data?.data || [];
  }

  async create<T = any>(resource: string, data: any): Promise<T> {
    const response = await httpService.post<PluginApiResponse<T>>(`${this.baseUrl}/${resource}`, data);
    return response.data;
  }
}
