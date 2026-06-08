'use strict';
const UserPermissionService = require('../../services/admin/user-permission-service');

const { handleError } = require('../../middleware/utils');
const { sendEmail } = require('../../utils/sendEmail');
const bcrypt = require('bcrypt');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * Helper — get User model safely (models are loaded after DB connects)
 */
const getUser = () => {
    const db = require('../../../config/database');
    const User = db.sequelize.models.User;
    if (!User) throw { code: 503, message: 'Server is still starting up. Please try again in a moment.' };
    return User;
};

/**
 * STEP 1 — Register: create unverified account + send OTP email
 */
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, roleId } = req.body;

        if (!firstName || !lastName || !email || !password || roleId === 0) {
            return handleError(res, { code: 400, message: 'All fields are required' });
        }

        if (password.length < 6) {
            return handleError(res, { code: 400, message: 'Password must be at least 6 characters' });
        }

        const User = getUser();

        // Check duplicate email
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return handleError(res, { code: 409, message: 'Email is already registered' });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,                           // hashed by beforeCreate hook
            dateOfBirth: '2000-01-01',          // required field — placeholder
            emailVerificationToken: otp,
            emailVerificationExpires: otpExpires,
            isEmailVerified: false,
        });   

        await sendEmail({
            to: email,
            subject: 'Your Registration OTP Code',
            html: `
                <h2>Welcome to AMAST!</h2>
                <p>Hi ${firstName}, your email verification code is:</p>
                <h1 style="letter-spacing:8px;color:#4F46E5;">${otp}</h1>
                <p>This code expires in <strong>15 minutes</strong>. Do not share it.</p>
            `,
        });

        if (newUser.id>0) {
            const userPermissionService = new UserPermissionService();
            const permissionResult = await userPermissionService.updatePermissions(newUser.id, [roleId]); // Assign selected role permissions as array for consistency
        }

        return res.status(201).json({
            success: true,
            message: 'Registration successful. Check your email for the 6-digit OTP.',
        });

    } catch (error) {
        console.error('Register error:', error);
        // If it's our own shaped error object pass it directly, otherwise wrap it
        if (error.code && error.message) {
            return handleError(res, error);
        }
        return handleError(res, { code: 500, message: error.message || 'Internal server error' });
    }
};

/**
 * STEP 2 — Verify email OTP to activate account
 */
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return handleError(res, { code: 400, message: 'Email and OTP are required' });
        }

        const User = getUser();

        // unscoped() so we can read emailVerificationToken (excluded by defaultScope)
        const user = await User.unscoped().findOne({ where: { email } });

        if (!user) {
            return handleError(res, { code: 404, message: 'User not found' });
        }

        if (user.isVerified === 1) {
            return res.status(200).json({ success: true, message: 'Email already verified. Please login.' });
        }

        if (!user.emailVerificationToken || user.emailVerificationToken !== otp) {
            return handleError(res, { code: 400, message: 'Invalid OTP code' });
        }

        if (new Date() > new Date(user.emailVerificationExpires)) {
            return handleError(res, { code: 400, message: 'OTP has expired. Please register again.' });
        }

        await user.update({
            isEmailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpires: null,
        });

        return res.status(200).json({ success: true, message: 'Email verified. You can now login.' });

    } catch (error) {
        console.error('VerifyEmail error:', error);
        if (error.code && error.message) {
            return handleError(res, error);
        }
        return handleError(res, { code: 500, message: error.message || 'Internal server error' });
    }
};

module.exports = { register, verifyEmail };
