'use strict';
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.SMTP_HOST) {
        console.log(`\n📧 [EMAIL — no SMTP_HOST, logging only]`);
        console.log(`To: ${to} | Subject: ${subject}`);
        console.log(`Body: ${html.replace(/<[^>]+>/g, '')}\n`);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"AMAST" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`✅ Email sent to ${to} — Message ID: ${info.messageId}`);

    } catch (err) {
        console.error(`❌ Email failed to send to ${to}:`, err.message);
        // Don't throw — email failure should not crash the registration flow
    }
};

module.exports = { sendEmail };