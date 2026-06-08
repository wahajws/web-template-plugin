'use strict';

const { itemNotFound } = require('../../middleware/utils');

/**
 * Updates an item in database by id (Sequelize version)
 * @param {string} id - item id
 * @param {Object} model - Sequelize model
 * @param {Object} req - request object
 */
const updateItem = async (id = '', model = {}, req = {}) => {
	// Remove undefined values
	Object.keys(req).forEach((key) => (req[key] === undefined ? delete req[key] : {}));
	
	try {
		const [updatedRowsCount] = await model.update(req, {
			where: { id: id },
			returning: true
		});
		
		if (updatedRowsCount === 0) {
			throw { code: 404, message: 'NOT_FOUND' };
		}
		
		// Fetch the updated item
		const item = await model.findByPk(id);
		await itemNotFound(null, item, 'NOT_FOUND');
		
		return item;
	} catch (error) {
		throw error;
	}
};

module.exports = { updateItem };
