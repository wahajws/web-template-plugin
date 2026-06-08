import { showErrorToast, showSuccessToast } from '@/utils/toast';
import PluginManagementService from '@/services/pluginManagementService';

class PluginManagementController {
  async getAll() {
    try {
      return await PluginManagementService.getAll();
    } catch (error: any) {
      showErrorToast('Failed to fetch plugins', error.message || 'Unable to load plugins');
      throw error;
    }
  }

  async install(name: string) {
    try {
      const result = await PluginManagementService.install(name);
      this.updateLocalPluginState(name, true);
      showSuccessToast('Plugin Installed', `${result.label} has been enabled`);
      return result;
    } catch (error: any) {
      showErrorToast('Failed to install plugin', error.message || 'Unable to install plugin');
      throw error;
    }
  }

  async uninstall(name: string) {
    try {
      const result = await PluginManagementService.uninstall(name);
      this.updateLocalPluginState(name, false);
      showSuccessToast('Plugin Uninstalled', `${result.label} has been disabled`);
      return result;
    } catch (error: any) {
      showErrorToast('Failed to uninstall plugin', error.message || 'Unable to uninstall plugin');
      throw error;
    }
  }

  async delete(name: string) {
    try {
      await PluginManagementService.delete(name);
      this.removeLocalPluginState(name);
      showSuccessToast('Plugin Deleted', `${name} has been deleted`);
    } catch (error: any) {
      showErrorToast('Failed to delete plugin', error.message || 'Unable to delete plugin');
      throw error;
    }
  }

  updateLocalPluginState(name: string, installed: boolean) {
    const state = this.getLocalPluginState();
    state[name] = installed;
    localStorage.setItem('plugin-storage', JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('plugins:changed'));
  }

  removeLocalPluginState(name: string) {
    const state = this.getLocalPluginState();
    delete state[name];
    localStorage.setItem('plugin-storage', JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('plugins:changed'));
  }

  getLocalPluginState(): Record<string, boolean> {
    const storedValue = localStorage.getItem('plugin-storage');
    return storedValue ? JSON.parse(storedValue) : {};
  }
}

export default new PluginManagementController();
