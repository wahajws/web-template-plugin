'use strict';
const { sequelize } = require('../../../config/database');
const { buildErrObject } = require('../../middleware/utils');
const { RECORD_STATUS_OPTIONS } = require('../../../../constants/global.ts');

/**
 * Generic CRUD operations helper for all Sequelize models
 * Based on: https://stackoverflow.com/questions/67454250/how-to-create-common-crud-operations-in-express-using-sequelize
 */
class BaseServiceHelper {

    constructor(serviceModel) {
        this.serviceModel = serviceModel;
    }

    /**
     * Find records with flexible options
     * @param {Object} params - Query parameters
     * @param {Object} [params.where={}] - Where conditions
     * @param {Array} [params.attributes] - Attributes to select
     * @param {Array} [params.include=[]] - Include associations
     * @param {number} [params.offset=0] - Offset for pagination
     * @param {number} [params.limit=10] - Limit for pagination
     * @param {Array} [params.order] - Order by clauses
     * @param {boolean} [params.distinct=false] - Use distinct
     * @returns {Object} - Query result with data and count
     */
    async findAll(params = {}) {

        try {
            const {
                filters = {},
                attributes = {},
                page = 1,
                limit = 10,
                include = [],
                order = [['createdDate', 'DESC']]
            } = params;

            const offset = (page - 1) * limit;

            // Build where conditions
            // Default filters - exclude deleted records 
            // This makes the service work even if record field is not present
            const where = { ...filters };

            // if (!where.hasOwnProperty('recordStatusId')) {
            //     // Only add isDeleted filter if the field exists in the model
            //     try {
            //         const User = require('../../config/dbConnect').sequelize.models.User;
            //         if (User && User.rawAttributes && User.rawAttributes.recordStatusId) {
            //             where.recordStatusId = RECORD_STATUS.Public;
            //         }
            //     } catch (error) {
            //         // If we can't access the model, skip the isDeleted filter
            //         console.log('Skipping isDeleted filter - field may not exist');
            //     }
            // }            

            // Get the model from sequelize
            const Model = sequelize.models[this.serviceModel];

            if (!Model) {
                throw buildErrObject(400, `Model '${this.serviceModel}' not found`);
            }

            // Build query options
            const queryOptions = {
                where,
            };

            if (attributes && attributes.length > 0) {
                queryOptions.attributes = attributes;
            }

            if (include && include.length > 0) {
                queryOptions.include = include;
            }

            if (order && order.length > 0) {
                queryOptions.order = order;
            }
           
            // Execute query
            const result = await Model.findAndCountAll(queryOptions);

            // console.log("BaserServiceHelper: ", JSON.parse(JSON.stringify(result.rows))); -- used for debugging url calls...

            return {
                success: true,
                data: JSON.parse(JSON.stringify(result.rows)),
                totalCount: result.count,
                currentPage: Math.floor(page / limit) + 1,
                totalPages: Math.ceil(result.count / limit),
                pageSize: limit
            };

        } catch (error) {
            console.error('baseServiceHelper.findAndCountAll error:', error);
            throw error.code ? error : buildErrObject(500, error.message);
        }
    }

    /**
     * Find a single record by primary key
     * @param {Object} params - Query parameters
     * @param {number|string} params.id - Primary key value
     * @param {Array} [params.attributes] - Attributes to select
     * @param {Array} [params.include=[]] - Include associations
     * @returns {Object} - Single record or null
     */
    async findById(params) {
        try {
            const {
                id,
                attributes,
                include = []
            } = params;

            const Model = sequelize.models[this.serviceModel];
            if (!Model) {
                throw buildErrObject(400, `Model '${this.serviceModel}' not found`);
            }

            const queryOptions = {};

            if (attributes && attributes.length > 0) {
                queryOptions.attributes = attributes;
            }

            if (include && include.length > 0) {
                queryOptions.include = include;
            }

            return await Model.findByPk(id, queryOptions);

        } catch (error) {
            console.error('baseServiceHelper.findById error:', error);
            throw error.code ? error : buildErrObject(500, error.message);
        }
    }

    /**
     * Find a single record by conditions
     * @param {Object} params - Query parameters
     * @param {Object} params.where - Where conditions
     * @param {Array} [params.attributes] - Attributes to select
     * @param {Array} [params.include=[]] - Include associations
     * @returns {Object} - Single record or null
     */
    async findOne(params) {
        try {
            const {
                where,
                attributes,
                include = []
            } = params;

            const Model = sequelize.models[this.serviceModel];
            if (!Model) {
                throw buildErrObject(400, `Model '${this.serviceModel}' not found`);
            }

            const queryOptions = { where };

            if (attributes && attributes.length > 0) {
                queryOptions.attributes = attributes;
            }

            if (include && include.length > 0) {
                queryOptions.include = include;
            }

            const result = await Model.findOne(queryOptions);
            
            return result;

        } catch (error) {
            console.error('baseServiceHelper.findOne error:', error);
            throw error.code ? error : buildErrObject(500, error.message);
        }
    }

    /**
     * Create a new record
     * @param {Object} params - Create parameters
     * @param {Object} params.data - Data to create
     * @param {Object} [params.transaction] - Database transaction
     * @returns {Object} - Created record
     */
    async create(params = {}) {
        try {
            const {
                data,
                transaction
            } = params;

            const Model = sequelize.models[this.serviceModel];
            if (!Model) {
                throw buildErrObject(400, `Model '${this.serviceModel}' not found`);
            }

            const options = {};
            if (transaction) {
                options.transaction = transaction;
            }

            data.createdDate = new Date();
            return await Model.create(data, options);
            
        } catch (error) {
            console.error('baseServiceHelper.create error:', error);
            throw error.code ? error : buildErrObject(500, error.message);
        }
    }

    /**
     * Create multiple records
     * @param {Object} params - Create parameters
     * @param {string} params.modelName - Name of the model
     * @param {Array} params.data - Array of data to create
     * @param {Object} [params.transaction] - Database transaction
     * @returns {Array} - Created records
     */
    // async bulkCreate(params = {}) {
    //     try {
    //         const {
    //             data,
    //             transaction
    //         } = params;

    //         const Model = sequelize.models[this.serviceModel];
    //         if (!Model) {
    //             throw buildErrObject(400, `Model '${this.serviceModel}' not found`);
    //         }

    //         const options = {};
    //         if (transaction) {
    //             options.transaction = transaction;
    //         }

    //         const result = await Model.bulkCreate(data, options);
            
    //         return result;

    //     } catch (error) {
    //         console.error('baseServiceHelper.bulkCreate error:', error);
    //         throw error.code ? error : buildErrObject(500, error.message);
    //     }
    // }

    /**
     * Update records
     * @param {Object} params - Update parameters
     * @param {Object} params.data - Data to update
     * @param {Object} params.where - Where conditions
     * @param {Object} [params.transaction] - Database transaction
     * @returns {Array} - [number of affected rows, affected rows (if returning: true)]
     */
    async update(params = {}, legacyData) {
        try {
            if (legacyData) {
                params = {
                    id: params,
                    data: legacyData
                };
            }

            const {
                id,
                data,
                where,
                transaction
            } = params;

            const Model = sequelize.models[this.serviceModel];
            if (!Model) {
                throw buildErrObject(400, `Model '${this.serviceModel}' not found`);
            }

            const options = { where };
            if (transaction) {
                options.transaction = transaction;
            }

            const recordToUpdate = await Model.findByPk(id);
            if (!recordToUpdate) {
                return null;
            }

            if (!data) {
                throw buildErrObject(400, 'Update data is required');
            }

            data.updatedDate = new Date();

            // console.log("BaseServiceHelper Update (before): ", JSON.parse(JSON.stringify(recordToUpdate)));
            // console.log("BaseServiceHelper Update (after): ", data);

            return await recordToUpdate.update(data);

        } catch (error) {
            console.error('baseServiceHelper.update error:', error);
            throw error.code ? error : buildErrObject(500, error.message);
        }
    }

    /**
     * Delete records
     * @param {Object} params - Delete parameters
     * @param {string} params.modelName - Name of the model
     * @param {Object} params.where - Where conditions
     * @param {Object} [params.transaction] - Database transaction
     * @returns {number} - Number of deleted rows
     */
    async delete(params = {}) {
        try {
            const {
                id,
                where,
                transaction
            } = params;

            const Model = sequelize.models[this.serviceModel];
            if (!Model) {
                throw buildErrObject(400, `Model '${this.serviceModel}' not found`);
            }

            const options = { where };
            if (transaction) {
                options.transaction = transaction;
            }
            // const result = await Model.destroy(options); // Permanent delete!

            const recordToUpdate = await Model.findByPk(id);

            const newData = {
                recordStatusId : RECORD_STATUS_OPTIONS.Deleted,
                updatedDate : new Date(),
            }

            // console.log("BaseServiceHelper Update (before): ", JSON.parse(JSON.stringify(recordToUpdate)));
            // console.log("BaseServiceHelper Update (after): ", newData);

            return await recordToUpdate.update(newData);

        } catch (error) {
            console.error('baseServiceHelper.delete error:', error);
            throw error.code ? error : buildErrObject(500, error.message);
        }
    }


    /**
     * Count records
     * @param {Object} params - Count parameters
     * @param {string} params.modelName - Name of the model
     * @param {Object} [params.where={}] - Where conditions
     * @param {Array} [params.include=[]] - Include associations
     * @param {boolean} [params.distinct=false] - Use distinct
     * @returns {number} - Count of records
     */
    async count(params) {
        try {
            const {
                where = {},
                include = [],
                distinct = false
            } = params;

            const Model = sequelize.models[this.serviceModel];
            if (!Model) {
                throw buildErrObject(400, `Model '${this.serviceModel}' not found`);
            }

            const queryOptions = {
                where,
                distinct
            };

            if (include && include.length > 0) {
                queryOptions.include = include;
            }

            return await Model.count(queryOptions);

        } catch (error) {
            console.error('baseServiceHelper.count error:', error);
            throw error.code ? error : buildErrObject(500, error.message);
        }
    }

    /**
     * Execute raw SQL query
     * @param {Object} params - Query parameters
     * @param {string} params.query - SQL query
     * @param {Object} [params.replacements] - Query replacements
     * @param {string} [params.type='SELECT'] - Query type
     * @returns {Array} - Query results
     */
    async rawQuery(params) {
        try {
            const {
                query,
                replacements = {},
                offset = 0,
                limit = 10,
                type = 'SELECT'
            } = params;

            const result = await sequelize.query(query, {
                replacements,
                type: sequelize.QueryTypes[type]
            });
            
            return {
                success: true,
                data: result,
                totalCount: result.length,
                currentPage: Math.floor(offset / limit) + 1,
                totalPages: Math.ceil(result.length / limit),
                pageSize: limit
            };

        } catch (error) {
            console.error('baseServiceHelper.rawQuery error:', error);
            throw error.code ? error : buildErrObject(500, error.message);
        }
    }

    /**
     * Begin database transaction
     * @returns {Object} - Transaction object
     */
    async beginTransaction() {
        try {
            return await sequelize.transaction();
        } catch (error) {
            console.error('baseServiceHelper.beginTransaction error:', error);
            throw buildErrObject(500, error.message);
        }
    }
}

module.exports = BaseServiceHelper;
