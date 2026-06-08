"use strict";
const UserPermissionService = require('../../services/admin/user-permission-service');
const  UserPermission = require('../../models/user-permission-model');
const BaseController = require('../helpers/base-controller-helper');
const sequelize = require('../../../config/database').sequelize;
const { QueryTypes } = require('sequelize');

class UserPermissionController extends BaseController{

    constructor() {
        super(new UserPermissionService());
    }

    getEnhanced = async (req, res) => {
        try {
            const result = await sequelize.query('SELECT * FROM vw_user_permission WHERE userId IS NOT NULL', {
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

    getByUserId = async (req, res) => {
        try {
            const result = await sequelize.query('SELECT * FROM vw_user_permission WHERE userId = :userId', {
                type: QueryTypes.SELECT,
                replacements: { userId: req.params.id }
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

    update = async (req, res) => {
        if(req.params.id>0){
            deleteByUserId(req, res);
            if(!res.success) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete existing permissions'
                });
                return;
            } 
        }

        const permissionDataArray = [];
        if (Array.isArray(req.body.roleId)) {
            req.body.roleId.forEach(roleId => {
                permissionDataArray.push({
                    userId: req.params.id,
                    roleId: roleId
                });
            });
        }

        try {
            // Execute bulk insert using Sequelize built-in method
            const result = await this.service.bulkCreate(permissionDataArray);

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

    deleteByUserId = async (req, res) => {
        if (req.params.id<1) return;        
        try {
            const result = await sequelize.query('DELETE * FROM user_permission WHERE userId = :userId', {
                type: QueryTypes.DELETE,
                replacements: { userId: req.params.id }
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
module.exports = new UserPermissionController();