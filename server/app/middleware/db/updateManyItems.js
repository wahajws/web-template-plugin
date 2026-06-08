'use strict';

const { itemNotFound } = require('../../middleware/utils');

/**
 * Updates an item in database by id
 * @param {object} filter - filter object
 * @param {object} model - model
 * @param {Object} req - request object
 */
const updateManyItems = (filter = {}, model = {}, req = {}) => {
	Object.keys(req).forEach((key) => (req[key] === undefined ? delete req[key] : {}));
	return new Promise((resolve, reject) => {
		model.updateMany(
			filter,
			req,
			{
				new: true,
				runValidators: true
			},
			async (err, item) => {
				try {
					await itemNotFound(err, item, 'NOT_FOUND');
					resolve(item);
				} catch (error) {
					reject(error);
				}
			}
		);
	});
};

module.exports = { updateManyItems };
