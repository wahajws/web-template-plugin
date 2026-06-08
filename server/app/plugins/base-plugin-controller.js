'use strict';

class BasePluginController {
  constructor(service) {
    if (!service) throw new Error('Service is required');
    this.service = service;
  }

  action = (methodName, status = 200) => {
    return async (req, res) => {
      await this.handle(res, () => this.service[methodName](req.body, req.params, req.query), status);
    };
  }

  list = (resourceName) => {
    return async (req, res) => {
      await this.handle(res, () => this.service.list(resourceName, req.query));
    };
  }

  create = (resourceName) => {
    return async (req, res) => {
      await this.handle(res, () => this.service.create(resourceName, req.body), 201);
    };
  }

  async handle(res, callback, status = 200) {
    try {
      const data = await callback();
      res.status(status).json({
        success: true,
        data,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  handleError(res, error) {
    console.error('Plugin Controller Error:', error);
    res.status(502).json({
      success: false,
      message: error.message || 'Plugin error',
    });
  }
}

module.exports = BasePluginController;
