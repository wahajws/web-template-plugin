'use strict';

const fs = require('fs');
const path = require('path');

class PluginManagerService {
  constructor() {
    this.pluginsPath = path.join(__dirname, '..', '..', 'plugins');
    this.clientPluginsPath = path.join(__dirname, '..', '..', '..', 'client', 'src', 'plugins');
    this.stateFilePath = path.join(this.pluginsPath, '.plugin-state.json');
  }

  async getAll() {
    return this.getPlugins();
  }

  async install(data, params) {
    const pluginName = params.name;
    const state = this.getState();

    state[pluginName] = {
      ...state[pluginName],
      installed: true,
      updatedDate: new Date().toISOString(),
    };

    this.saveState(state);
    return this.getPlugin(pluginName);
  }

  async uninstall(data, params) {
    const pluginName = params.name;
    const state = this.getState();

    state[pluginName] = {
      ...state[pluginName],
      installed: false,
      updatedDate: new Date().toISOString(),
    };

    this.saveState(state);
    return this.getPlugin(pluginName);
  }

  async delete(data, params) {
    const pluginName = params.name;

    if (data.confirmName !== pluginName) {
      throw new Error('Plugin delete requires matching confirmName');
    }

    const deletedPaths = [];
    const pluginPaths = [
      this.getPluginPath(pluginName),
      this.getClientPluginPath(pluginName),
    ];

    pluginPaths.forEach((pluginPath) => {
      this.validatePluginPath(pluginName, pluginPath);

      if (fs.existsSync(pluginPath)) {
        fs.rmSync(pluginPath, { recursive: true, force: true });
        deletedPaths.push(pluginPath);
      }
    });

    const state = this.getState();
    delete state[pluginName];
    this.saveState(state);

    return {
      name: pluginName,
      deleted: true,
      deletedPaths,
    };
  }

  isInstalled(pluginName) {
    const state = this.getState();
    return state[pluginName]?.installed !== false;
  }

  getPlugins() {
    if (!fs.existsSync(this.pluginsPath)) {
      return [];
    }

    return fs.readdirSync(this.pluginsPath, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((item) => this.getPlugin(item.name))
      .filter(Boolean);
  }

  getPlugin(pluginName) {
    const pluginPath = this.getPluginPath(pluginName);

    if (!fs.existsSync(pluginPath)) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    const manifest = this.getManifest(pluginName);
    const state = this.getState();

    return {
      name: manifest.name || pluginName,
      label: manifest.label || pluginName,
      description: manifest.description || '',
      installed: state[pluginName]?.installed !== false,
      canDelete: true,
      path: pluginPath,
      updatedDate: state[pluginName]?.updatedDate || null,
    };
  }

  getManifest(pluginName) {
    const pluginFilePath = path.join(this.getPluginPath(pluginName), 'plugin.js');

    if (!fs.existsSync(pluginFilePath)) {
      return { name: pluginName, label: pluginName };
    }

    delete require.cache[require.resolve(pluginFilePath)];
    return require(pluginFilePath);
  }

  getState() {
    if (!fs.existsSync(this.stateFilePath)) {
      return {};
    }

    try {
      return JSON.parse(fs.readFileSync(this.stateFilePath, 'utf8'));
    } catch (error) {
      console.error('Failed to read plugin state:', error.message);
      return {};
    }
  }

  saveState(state) {
    if (!fs.existsSync(this.pluginsPath)) {
      fs.mkdirSync(this.pluginsPath, { recursive: true });
    }

    fs.writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2));
  }

  getPluginPath(pluginName) {
    return path.join(this.pluginsPath, pluginName);
  }

  getClientPluginPath(pluginName) {
    return path.join(this.clientPluginsPath, pluginName);
  }

  validatePluginPath(pluginName, pluginPath) {
    if (!/^[a-zA-Z0-9_-]+$/.test(pluginName)) {
      throw new Error('Invalid plugin name');
    }

    const resolvedPath = path.resolve(pluginPath);
    const allowedRoots = [
      path.resolve(this.pluginsPath),
      path.resolve(this.clientPluginsPath),
    ];

    const isAllowed = allowedRoots.some((allowedRoot) => {
      return resolvedPath === path.join(allowedRoot, pluginName)
        && resolvedPath.startsWith(allowedRoot);
    });

    if (!isAllowed) {
      throw new Error('Invalid plugin delete path');
    }
  }
}

module.exports = new PluginManagerService();
