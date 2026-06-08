'use strict';
const BaseServiceHelper = require('../helpers/base-service-helper');

class CompanyService extends BaseServiceHelper {
   
    constructor() {
        super('Company'); // pass Sequelize model name to BaseService
    }
}
module.exports = CompanyService;