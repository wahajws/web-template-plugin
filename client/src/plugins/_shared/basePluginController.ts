import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { BasePluginService } from './basePluginService';

interface PluginMessage {
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
}

export class BasePluginController {
  readonly service: BasePluginService;
  readonly label: string;

  constructor(service: BasePluginService, label: string) {
    this.service = service;
    this.label = label;
  }

  async get<T = any>(path: string, message?: PluginMessage): Promise<T> {
    try {
      return await this.service.get<T>(path);
    } catch (error: any) {
      showErrorToast(message?.errorTitle || `${this.label} Failed`, error.message || message?.errorMessage || 'Unable to load data');
      throw error;
    }
  }

  async list<T = any>(resource: string, message?: PluginMessage): Promise<T[]> {
    try {
      return await this.service.list<T>(resource);
    } catch (error: any) {
      showErrorToast(message?.errorTitle || `${this.label} Data Failed`, error.message || message?.errorMessage || 'Unable to load data');
      throw error;
    }
  }

  async create<T = any>(resource: string, data: any, message?: PluginMessage): Promise<T> {
    try {
      const result = await this.service.create<T>(resource, data);
      showSuccessToast(message?.successTitle || 'Record Created', message?.successMessage || 'Record has been successfully created');
      return result;
    } catch (error: any) {
      showErrorToast(message?.errorTitle || `${this.label} Create Failed`, error.message || message?.errorMessage || 'Unable to create record');
      throw error;
    }
  }
}
