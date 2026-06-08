'use strict';
const fs = require('fs');
const path = require('path');
const BaseServiceHelper = require('./helpers/base-service-helper');

/**
 * User Service - CRUD operations for User model
 * Uses the generic BaseModelHelper for database operations
 */
class UserService extends BaseServiceHelper {

    constructor() {
        super('User'); // pass Sequelize model name to BaseService
    }

    // /**
    //  * Get user by email
    //  * @param {string} email - User email
    //  * @param {boolean} [includePassword=false] - Include password in result
    //  * @returns {Object|null} - User object or null
    //  */
    async getUserByEmail(email, withPassword = false) {
        try {
            const attributes = withPassword 
                ? 'withPassword'
                : 'withoutPassword';

            const where = { email };
            const User = require('../../config/database').sequelize.models.User;

            // Only add isDeleted filter if the field exists
            try {
                if (User && User.rawAttributes && User.rawAttributes.isDeleted) {
                    where.isDeleted = false;
                }
            } catch (error) {
                // Skip isDeleted filter if field doesn't exist
            }

            const user = await User.scope(attributes).findOne({
                where: { email }
            });

            return user;

        } catch (error) {
            console.error('UserService.getUserByEmail error:', error);
            throw error;
        }
    }
}

module.exports = UserService;
