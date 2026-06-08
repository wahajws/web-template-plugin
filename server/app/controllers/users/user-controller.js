'use strict';
const BaseController = require('../helpers/base-controller-helper');
const UserService = require('../../services/user-service');
const UserPermissionService = require('../../services/admin/user-permission-service');
const { HTML_STATUS_CODES } = require('../../../../constants/global.ts');

class UserController extends BaseController{

    constructor(req, res) {
        super(new UserService());
    }

    getNavMenu = async (req, res) => {
        try {
            const userId=req.params.id;
            const result = await this.service.rawQuery({ query: `SELECT * FROM vw_navigation_menu_users WHERE userid=${ userId } ORDER BY parentid`});          
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
        try {            
            const id = req.params.id;
            const data = { ...req.body };
            const roleId = req.body.roleId;

            delete data.id;
            delete data.userId;
            delete data.roleId;

            // Strip non-numeric characters from phone before saving
            if (data.phone !== undefined && data.phone !== null) {
                data.phone = data.phone === '' ? null : data.phone.replace(/\D/g, '');
            }

            const result = await this.service.update({ id: id, data: data });
            if (!result) {
                return res.status(HTML_STATUS_CODES.NotFound).json({
                success: false,
                message: 'Record not found'
                });
            }

            // Only update permissions if roleId was explicitly sent
            if (roleId !== undefined && roleId !== null) {
                const userPermissionService = new UserPermissionService();
                await userPermissionService.updatePermissions(id, Array.isArray(roleId) ? roleId : [roleId]);
            }

            res.status(HTML_STATUS_CODES.Success).json({
                success: true,
                data: result
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }
}


module.exports = new UserController();