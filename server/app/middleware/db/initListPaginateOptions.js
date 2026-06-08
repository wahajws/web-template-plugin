'use strict';

const { buildErrObject } = require('../../middleware/utils');
const { buildSort } = require('./buildSort');

/**
 * Builds initial options for body
 * @param {Object} body - body object
 */
const initListPaginateOptions = (req = {}) => {
	return new Promise(async (resolve, reject) => {
		try {
			const order = req.body.order || -1;
			const sort = req.body.sort || 'createdAt';
			const sortBy = buildSort(sort, order);
			const page = parseInt(req.body.page, 10) || 1;
			const limit = parseInt(req.body.limit, 10) || 5;
			const options = {
				sort: sortBy,
				lean: true,
				page,
				limit,
				select: {
					password: 0
				}
			};
			resolve(options);
		} catch (error) {
			console.log(error.message);
			reject(buildErrObject(422, 'ERROR_WITH_PAGINATE_OPTIONS'));
		}
	});
};

module.exports = { initListPaginateOptions };
