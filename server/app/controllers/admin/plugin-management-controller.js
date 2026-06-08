'use strict';

const BasePluginController = require('../../plugins/base-plugin-controller');
const PluginManagerService = require('../../plugins/plugin-manager-service');

class PluginManagementController extends BasePluginController {
  constructor() {
    super(PluginManagerService);
  }

  getAll = this.action('getAll');
  install = this.action('install');
  uninstall = this.action('uninstall');
  delete = this.action('delete');
}

module.exports = new PluginManagementController();
