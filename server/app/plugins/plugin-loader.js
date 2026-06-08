'use strict';

const fs = require('fs');
const path = require('path');
const PluginManagerService = require('./plugin-manager-service');

const isPluginTrackingEnabled = () => {
  return String(process.env.TRACK_PLUGIN || '').toLowerCase() === 'true';
};

const loadPlugins = (router) => {
  if (!isPluginTrackingEnabled()) {
    console.log('Plugin tracking disabled');
    return [];
  }

  const pluginsPath = path.join(__dirname, '..', '..', 'plugins');

  if (!fs.existsSync(pluginsPath)) {
    console.log('Plugin folder not found');
    return [];
  }

  const plugins = [];

  fs.readdirSync(pluginsPath, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .forEach((item) => {
      const pluginPath = path.join(pluginsPath, item.name, 'plugin.js');

      if (!fs.existsSync(pluginPath)) {
        return;
      }

      if (!PluginManagerService.isInstalled(item.name)) {
        console.log(`Plugin skipped: ${item.name}`);
        return;
      }

      try {
        const plugin = require(pluginPath);

        if (plugin && typeof plugin.register === 'function') {
          plugin.register({ router });
          plugins.push({
            name: plugin.name || item.name,
            label: plugin.label || item.name,
          });
          console.log(`Plugin loaded: ${plugin.label || item.name}`);
        }
      } catch (error) {
        console.error(`Plugin failed to load: ${item.name}`, error.message);
      }
    });

  return plugins;
};

module.exports = {
  loadPlugins,
};
