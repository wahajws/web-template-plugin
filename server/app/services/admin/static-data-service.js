'use strict';
const BaseServiceHelper = require('../helpers/base-service-helper');

class StaticDataService extends BaseServiceHelper {

    constructor() {
        super('StaticData'); // pass Sequelize model name to BaseService
    }

        /**
     * Get user statistics
     * @returns {Object} - User statistics
     */
    async getByKey(dataKey) {
        console.log("StaticDataService.getByKey (dataKey: ", dataKey,")");
        try {
            return await this.findAll({
                filters: { dataKey: dataKey },
                order: [['dataText', 'ASC']]
            });
        } catch (error) {
            console.error('StaticDataService.getByKey error:', error);
            throw error;
        }
    }
}
module.exports = StaticDataService;
