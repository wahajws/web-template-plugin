"use strict";
const SettingsService = require('../../services/admin/settings-service');
const BaseController = require('../helpers/base-controller-helper');
const { HTML_STATUS_CODES } = require('../../../../constants/global.ts');

class SettingsController extends BaseController{

    constructor() {
        super(new SettingsService());
    }

    getByKey = async (req, res) => {
        try {
            console.log("SettingsController.getByKey : req.params", req.params);   
            const dataKey = req.params.dataKey;
            const items = await this.service.getByKey(dataKey);    

            res.status(HTML_STATUS_CODES.Success).json({
                success: true,
                data: items.data,
                totalCount: items.totalCount,
                currentPage: items.currentPage,
                totalPages: items.totalPages,
                pageSize: items.pageSize,
            });
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(HTML_STATUS_CODES.InternalServerError).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }
}
module.exports = new SettingsController();