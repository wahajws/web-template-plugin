'use strict';

const UserService = require('../../services/user-service');
const UserLoggerService = require('../../services/user-logger');
const UserPermissionService = require('../../services/admin/user-permission-service');
const { handleError } = require('../../middleware/utils');
const { generateToken } = require('../../utils/generateToken');

/**
 * Login function that works with our new CRUD system
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return handleError(res, { 
                code: 400, 
                message: 'Email and password are required' 
            });
        }

        // Find user by email (includes password for comparison)
        const userService = new UserService();
        const user = await userService.getUserByEmail(email, true);
        
        if (!user) {
            return handleError(res, { 
                code: 401, 
                message: 'Invalid email or password' 
            });
        }

        // Check if user is locked out
        if (user.isLockedOut) {
            return handleError(res, { 
                code: 401, 
                message: 'Account is locked. Please contact administrator.' 
            });
        }
        
        // Compare password with hash
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return handleError(res, { 
                code: 401, 
                message: 'Invalid email or password' 
            });
        }

        // Log the successful login attempt
        const userLoggerService = new UserLoggerService();
        const userLogger = await userLoggerService.create({
            data: {     
                header: JSON.stringify(req.headers),
                action: 'login',
                createdBy: user.id
            }
        });

        // Generate JWT token
        const accessToken = generateToken(user.id);

        // Fetch user roles
        const userPermissionService = new UserPermissionService();
        let roleId = [];
        try {
            const permissions = await userPermissionService.getPermissionsByUserId(user.id);
            roleId = permissions.map(p => p.roleId).filter(Boolean);
        } catch (e) {
            // if permissions fail, just return empty roles
        }

        // Return user data without password
        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isVerified: user.isVerified,
            genderId: user.genderId,
            avatar: user.avatar,
            createdDate: user.createdDate,
            roleId,
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            userData: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        handleError(res, error);
    }
};
module.exports = {login};