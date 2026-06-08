'use strict';
const BaseServiceHelper = require('../helpers/base-service-helper');

class NavMenuRoleService extends BaseServiceHelper {
   
    constructor() {
        super('NavigationMenuRole'); // pass Sequelize model name to BaseService
    }
}
module.exports = NavMenuRoleService;
