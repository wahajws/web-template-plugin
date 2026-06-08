'use strict';

const bcrypt = require('bcrypt');

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
const hashPasswordBCrypt = (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    return bcrypt.hashSync(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} - True if password matches
 */
const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = {
    hashPasswordBCrypt,
    comparePassword
};
