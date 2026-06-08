'use strict';

const crypto = require('crypto');

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
const hashPasswordSha2 = (password) => {
  const hash = crypto.createHash('sha256'); // Specify the SHA-2 variant
  hash.update(password); // Update the hash with the input string
  return hash.digest('hex'); // Get the hash in hexadecimal format
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} - True if password matches
 */
const comparePassword = (password, hashedPassword) => {
    return (hashPasswordSha2(password)===hashedPassword);
};

module.exports = {
    hashPasswordSha2,
    comparePassword
};
