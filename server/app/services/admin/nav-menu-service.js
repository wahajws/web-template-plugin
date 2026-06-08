'use strict';
const BaseServiceHelper = require('../helpers/base-service-helper');

class NavigationMenuService extends BaseServiceHelper {
   
    constructor() {
        super('NavigationMenu'); // pass Sequelize model name to BaseService
    }
}
module.exports = NavigationMenuService;
