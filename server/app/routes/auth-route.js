'use strict';

const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');
require('../utils/passport');

const { login }                         = require('../controllers/auth/login');
const { register, verifyEmail }         = require('../controllers/auth/register');
const { forgotPassword, sendResetLink, resetPassword, resetPasswordByToken } = require('../controllers/auth/forgotPassword');

// Login
router.post('/login', trimRequest.all, login);

// Register & email verification
router.post('/register',     trimRequest.all, register);
router.post('/verify-email', trimRequest.all, verifyEmail);

// Forgot & reset password
router.post('/forgot-password', trimRequest.all, forgotPassword);
router.post('/reset-password',  trimRequest.all, resetPassword);

// Change password via link (Profile page Security tab)
router.post('/send-reset-link',       trimRequest.all, sendResetLink);
router.post('/reset-password-token',  trimRequest.all, resetPasswordByToken);

module.exports = router;