'use strict';

const { handleError } = require('../../middleware/utils');
const { sendEmail } = require('../../utils/sendEmail');
const crypto = require('crypto');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const getUser = () => {
    const db = require('../../../config/database');
    const User = db.sequelize.models.User;
    if (!User) throw { code: 503, message: 'Server is still starting up. Please try again in a moment.' };
    return User;
};

/**
 * STEP 1 — Send password reset OTP (used by /forgot-password public page)
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return handleError(res, { code: 400, message: 'Email is required' });
        }

        const User = getUser();
        const user = await User.unscoped().findOne({ where: { email } });

        // Always return OK — do not reveal whether the email exists
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If that email is registered, an OTP has been sent.',
            });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.update({
            passwordToken: otp,
            passwordTokenExpires: otpExpires,
        });

        await sendEmail({
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <h2>Password Reset Request</h2>
                <p>Your password reset code is:</p>
                <h1 style="letter-spacing:8px;color:#4F46E5;">${otp}</h1>
                <p>Expires in <strong>15 minutes</strong>. Ignore this if you did not request it.</p>
            `,
        });

        return res.status(200).json({
            success: true,
            message: 'If that email is registered, an OTP has been sent.',
        });

    } catch (error) {
        console.error('ForgotPassword error:', error);
        if (error.code && error.message) return handleError(res, error);
        return handleError(res, { code: 500, message: error.message || 'Internal server error' });
    }
};

/**
 * STEP 1b — Send password reset LINK (used by Profile page Security tab)
 */
const sendResetLink = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return handleError(res, { code: 400, message: 'Email is required' });
        }

        const User = getUser();
        const user = await User.unscoped().findOne({ where: { email } });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If that email is registered, a reset link has been sent.',
            });
        }

        // Generate a secure random token
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        await user.update({
            passwordToken: token,
            passwordTokenExpires: tokenExpires,
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

        await sendEmail({
            to: email,
            subject: 'Reset Your Password',
            html: `
                <h2>Password Reset Request</h2>
                <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
                <p style="margin:24px 0;">
                    <a href="${resetLink}"
                       style="background:#4F46E5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
                        Reset Password
                    </a>
                </p>
                <p style="font-size:12px;color:#888;">Or copy this link: ${resetLink}</p>
                <p style="font-size:12px;color:#888;">Ignore this email if you did not request a password reset.</p>
            `,
        });

        return res.status(200).json({
            success: true,
            message: 'A password reset link has been sent to your email.',
        });

    } catch (error) {
        console.error('SendResetLink error:', error);
        if (error.code && error.message) return handleError(res, error);
        return handleError(res, { code: 500, message: error.message || 'Internal server error' });
    }
};

/**
 * STEP 2a — Verify OTP and set new password (used by /forgot-password public page)
 */
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return handleError(res, { code: 400, message: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return handleError(res, { code: 400, message: 'Password must be at least 6 characters' });
        }

        const User = getUser();
        const user = await User.unscoped().findOne({ where: { email } });

        if (!user) {
            return handleError(res, { code: 404, message: 'User not found' });
        }

        if (!user.passwordToken || user.passwordToken !== otp) {
            return handleError(res, { code: 400, message: 'Invalid OTP code' });
        }

        if (new Date() > new Date(user.passwordTokenExpires)) {
            return handleError(res, { code: 400, message: 'OTP has expired. Please request a new one.' });
        }

        await user.update({
            password: newPassword,
            passwordToken: null,
            passwordTokenExpires: null,
        });

        return res.status(200).json({ success: true, message: 'Password reset successful. You can now login.' });

    } catch (error) {
        console.error('ResetPassword error:', error);
        if (error.code && error.message) return handleError(res, error);
        return handleError(res, { code: 500, message: error.message || 'Internal server error' });
    }
};

/**
 * STEP 2b — Reset password via link token (used by /reset-password page from Profile)
 */
const resetPasswordByToken = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return handleError(res, { code: 400, message: 'Email, token, and new password are required' });
        }

        if (newPassword.length < 6) {
            return handleError(res, { code: 400, message: 'Password must be at least 6 characters' });
        }

        const User = getUser();
        const user = await User.unscoped().findOne({ where: { email } });

        if (!user) {
            return handleError(res, { code: 404, message: 'User not found' });
        }

        if (!user.passwordToken || user.passwordToken !== token) {
            return handleError(res, { code: 400, message: 'Invalid or already used reset link' });
        }

        if (new Date() > new Date(user.passwordTokenExpires)) {
            return handleError(res, { code: 400, message: 'Reset link has expired. Please request a new one.' });
        }

        await user.update({
            password: newPassword,
            passwordToken: null,
            passwordTokenExpires: null,
        });

        return res.status(200).json({ success: true, message: 'Password updated successfully. You can now login.' });

    } catch (error) {
        console.error('ResetPasswordByToken error:', error);
        if (error.code && error.message) return handleError(res, error);
        return handleError(res, { code: 500, message: error.message || 'Internal server error' });
    }
};

module.exports = { forgotPassword, sendResetLink, resetPassword, resetPasswordByToken };