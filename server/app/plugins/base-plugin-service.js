'use strict';

class BasePluginService {
  constructor(resources = {}) {
    this.resources = resources;
  }

  getResource(resourceName) {
    const resource = this.resources[resourceName];

    if (!resource) {
      throw new Error(`Plugin resource '${resourceName}' not found`);
    }

    return resource;
  }

  async list(resourceName, query = {}) {
    const resource = this.getResource(resourceName);

    if (!resource.list) {
      throw new Error(`Plugin resource '${resourceName}' does not support list`);
    }

    return await resource.list(query);
  }

  async create(resourceName, data = {}) {
    const resource = this.getResource(resourceName);

    if (!resource.create) {
      throw new Error(`Plugin resource '${resourceName}' does not support create`);
    }

    return await resource.create(data);
  }
}

module.exports = BasePluginService;
