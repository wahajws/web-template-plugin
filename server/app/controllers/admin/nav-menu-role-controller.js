'use strict';
const NavMenuRoleService = require('../../services/admin/nav-menu-role-service');
const BaseController = require('../helpers/base-controller-helper');
const sequelize = require('../../../config/database').sequelize;
const { QueryTypes } = require('sequelize');

class NavMenuRoleController extends BaseController{

    constructor() {
        super(new NavMenuRoleService());
    }
    
    getEnhanced = async (req, res) => {
        try {
            const result = await sequelize.query('SELECT * FROM vw_navigation_menu_roles', {
                type: QueryTypes.SELECT,
            });

            if (!result) {
                return res.status(404).json({
                success: false,
                message: 'Records not found'
                });
            }

            res.status(200).json({
                success: true,
                data: result
            });
            } catch (error) {
                this.handleError(res, error);
            }
    }

    // // Common error handler
    // handleError(res, error) {
    //     console.error('Controller Error:', error);
    //     res.status(500).json({
    //         success: false,
    //         message: error.message || 'Internal server error'
    //     });
    // }
}

module.exports = new NavMenuRoleController();
