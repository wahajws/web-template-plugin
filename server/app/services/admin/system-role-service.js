'use strict';
const BaseServiceHelper = require('../helpers/base-service-helper');

class SystemRoleService extends BaseServiceHelper {

    constructor() {
        super('SystemRole'); // pass Sequelize model name to BaseService
    }
}
module.exports = SystemRoleService;
