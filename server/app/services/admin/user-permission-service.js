'use strict';
const BaseServiceHelper = require('../helpers/base-service-helper');
const sequelize = require('../../../config/database').sequelize;
const { QueryTypes } = require('sequelize');

class UserPermissionService extends BaseServiceHelper {

    constructor() {
        super('UserPermission'); // pass Sequelize model name to BaseService
    }

    getPermissionsByUserId = async (userId) => {
        try {
            const permissions = await sequelize.query(
                `SELECT * FROM vw_user_permission WHERE user_id = :userId`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { userId: userId }    
                }
            );
            return permissions;
        } catch (error) {
            console.error('UserPermissionService.getPermissionsByUserId error:', error);
            throw error;
        }
    }

    updatePermissions = async (userId, roles) => {
        try {
            const deletedCount = await sequelize.query(`DELETE FROM user_permission WHERE user_id = :userId`, {
                type: QueryTypes.DELETE,
                replacements: { userId: userId }
            });

            for (const roleId of roles) {
                await sequelize.query(`INSERT INTO user_permission (user_id, role_id) VALUES (:userId, :roleId)`, {
                    type: QueryTypes.INSERT,
                    replacements: { userId: userId, roleId: roleId }
                });
            }
        } catch (error) {
            console.error('UserPermissionService.updatePermissions error:', error);
            throw error;
        }
    }
}
module.exports = UserPermissionService;
