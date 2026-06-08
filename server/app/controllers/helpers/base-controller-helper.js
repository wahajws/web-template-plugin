'use strict';
const { HTML_STATUS_CODES } = require('../../../../constants/global.ts');

class BaseController {

  constructor(service) {
    if (!service) throw new Error('Service is required');
      this.service = service;
  }


  // Common CRUD operations
  getAll = async (req, res) => {
    try {
      const items = await this.service.findAll(req.params);
      res.status(HTML_STATUS_CODES.Success).json({
        success: true,
        data: items.data,
        totalCount: items.totalCount,
        currentPage: items.currentPage,
        totalPages: items.totalPages,
        pageSize: items.pageSize,
      });
    } catch (error) {
        this.handleError(res, error);
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await this.service.findById(req.params);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Record not found'
        });
      }

      res.status(HTML_STATUS_CODES.Success).json({
        success: true,
        data: item
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  create = async (req, res) => {
    try {
      const item = await this.service.create({ data: req.body });
      res.status(HTML_STATUS_CODES.Created).json({
        success: true,
        data: item
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await this.service.update({ id:id, data: req.body });
      
      if (!item) {
        return res.status(HTML_STATUS_CODES.NotFound).json({
          success: false,
          message: 'Record not found'
        });
      }

      res.status(HTML_STATUS_CODES.Success).json({
        success: true,
        data: item
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.service.delete({ id: id });
      
      if (!deleted) {
        return res.status(HTML_STATUS_CODES.NotFound).json({
          success: false,
          message: 'Record not found'
        });
      }

      res.status(HTML_STATUS_CODES.Success).json({
        success: true,
        message: 'Record deleted successfully'
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Common error handler
  handleError(res, error) {
    console.error('Controller Error:', error);
    res.status(HTML_STATUS_CODES.InternalServerError).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
}

module.exports = BaseController;
