'use strict';

const { removeExtensionFromFile } = require('./removeExtensionFromFile');
const { generateRandomNumbers } = require('./generateRandomNumbers');
const { sendQuotationsToEmail } = require('./sendQuotationsToEmail');
const { hashPassword, comparePassword } = require('./passwordHashSha2');

module.exports = {
	removeExtensionFromFile,
	generateRandomNumbers,
	sendQuotationsToEmail,
	hashPassword,
	comparePassword
};
