'use strict';
const BaseServiceHelper = require('./helpers/base-service-helper');

/**
 * UserLogger Service - CRUD operations for UserLogger model
 * Uses the generic BaseModelHelper for database operations
 */
class UserLoggerService extends BaseServiceHelper {

    constructor() {
        super('UserLogger'); // pass Sequelize model name to BaseService
    }
}
module.exports = UserLoggerService;
