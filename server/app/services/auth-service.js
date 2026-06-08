'use strict';
const { buildErrObject } = require('../middleware/utils');
const sequelizeModels = require('../../config/database').sequelize.models;
const UserPermissions = require('../permissions/user-permissions');

class AuthService {
  
    errObject = undefined;
    userPermissions = new UserPermissions();

    constructor() {
        this.errObject = buildErrObject;
    }

    async isAuthorised(userId, roleid) {  
        try {         
            const userRoleAssigned = await this.userPermissions.getUserPermissions(userId);

            if (userRoleAssigned) {
            const isInRole = await userRoleAssigned.findAll({
                        where: { userId: userId, roleId: roleid }
                    });
                return (isInRole);
            }
            return false;
        } catch (error) {
            console.error('AuthService.isAuthorised error:', error);
            throw error;    
        }
    }

    async isAdministrator(userId) {
        try {
            const currentUserPermissions = await this.userPermissions.getUserPermissions(userId);
            if (currentUserPermissions.some(p => p.isAdministrator === true)) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('AuthService.isAdministrator error:', error);
            throw error;
        }   
    }
};

module.exports = new AuthService();
