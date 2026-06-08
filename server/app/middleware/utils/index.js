'use strict';

const { buildErrObject } = require('./buildErrObject');
// const { buildSuccObject } = require('./buildSuccObject');
// const { getBrowserInfo } = require('./getBrowserInfo');
// const { getCountry } = require('./getCountry');
// const { getIP } = require('./getIP');
const { handleError } = require('./handleError');
// const { isIDGood } = require('./isIDGood');
const { itemNotFound } = require('./itemNotFound');
const { isItemExists } = require('./isItemExists');
// const { removeExtensionFromFile } = require('./removeExtensionFromFile');
// const { validateResult } = require('./validateResult');
// const { unauthorized } = require('./unauthorized');

module.exports = {
	buildErrObject,
	// buildSuccObject,
	// getBrowserInfo,
	// getCountry,
	// getIP,
	handleError,
	// isIDGood,
	itemNotFound,
	isItemExists
	// removeExtensionFromFile,
	// validateResult,
	// unauthorized
};
