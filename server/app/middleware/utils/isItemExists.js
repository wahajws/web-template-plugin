'use strict';

/**
 * Gets item from database by id
 * @param {string} id - item id
 */
const isItemExists = (id = '', model = {}) => {
	return new Promise((resolve, reject) => {
		model.findById(id, async (err, item) => {
			try {
				console.log(item);
				if (item) {
					resolve(true);
				} else {
					resolve(false);
				}
			} catch (error) {
				reject(error);
			}
		});
	});
};

module.exports = { isItemExists };
