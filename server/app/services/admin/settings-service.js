'use strict';
const BaseServiceHelper = require('../helpers/base-service-helper');

class SettingsService extends BaseServiceHelper {
   
    constructor() {
        super('Settings'); // pass Sequelize model name to BaseService
    }
}
module.exports = SettingsService;