"use strict";
const SystemRoleService = require('../../services/admin/system-role-service');
const BaseController = require('../helpers/base-controller-helper');

class SystemRoleController extends BaseController{

    constructor() {
        super(new SystemRoleService());
    }
}
module.exports = new SystemRoleController();