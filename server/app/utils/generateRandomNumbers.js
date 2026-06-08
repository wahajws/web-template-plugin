const crypto = require('crypto');

const generateRandomNumbers = (length) => {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(length, function(err, buffer) {
			if (err) {
				reject(err);
			} else {
				console.log(buffer);
				resolve(buffer.toString('hex'));
			}
		});
	});
};

module.exports = { generateRandomNumbers };
