'use strict';

const { itemNotFound } = require('../../middleware/utils');
const { initListPaginateOptions } = require('./initListPaginateOptions');

/**
 * get All items from passed model.
 * @param {Object} model - item id
 */
const getAllRows = async (model = {}, req = {}) => {
	try {
		const option = await initListPaginateOptions(req);
		
		// Convert MongoDB pagination to Sequelize
		const offset = (option.page - 1) * option.limit;
		const limit = option.limit;
		
		const { count, rows } = await model.findAndCountAll({
			offset: offset,
			limit: limit,
			order: option.sort ? [[option.sort.field || 'createdAt', option.sort.order || 'DESC']] : [['createdAt', 'DESC']]
		});
		
		// Format response similar to MongoDB paginate
		const result = {
			docs: rows,
			totalDocs: count,
			limit: limit,
			page: option.page,
			totalPages: Math.ceil(count / limit),
			hasNextPage: option.page < Math.ceil(count / limit),
			hasPrevPage: option.page > 1,
			nextPage: option.page < Math.ceil(count / limit) ? option.page + 1 : null,
			prevPage: option.page > 1 ? option.page - 1 : null
		};
		
		await itemNotFound(null, result, 'NOT_FOUND');
		return result;
	} catch (error) {
		throw error;
	}
};

module.exports = { getAllRows };
