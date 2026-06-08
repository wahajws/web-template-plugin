"use strict";
const CompanyService = require('../../services/admin/company-service');
const BaseController = require('../helpers/base-controller-helper');

class CompanyController extends BaseController{

    constructor() {
        super(new CompanyService());
    }
}
module.exports = new CompanyController();