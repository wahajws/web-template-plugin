'use strict';
const NavigationMenuService = require('../../services/admin/nav-menu-service');
const BaseController = require('../helpers/base-controller-helper');
const sequelize = require('../../../config/database').sequelize;
const { QueryTypes } = require('sequelize');

class NavMenuController extends BaseController{

    constructor() {
        super(new NavigationMenuService());
    }

    getAll = async (req, res) => {
        const userId = req.body.id;
        try {
            const result = await sequelize.query(`SELECT * FROM vw_navigation_menus ORDER BY parentId,orderIndex`, {
                type: QueryTypes.SELECT
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

    getAuthorised = async (req, res) => {
        const userId = req.body.id;
        try {
            const result = await sequelize.query(`SELECT * FROM vw_navigation_menu_users WHERE userId = ${userId} ORDER BY parentId,orderIndex`, {
                type: QueryTypes.SELECT
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
}

module.exports = new NavMenuController();
