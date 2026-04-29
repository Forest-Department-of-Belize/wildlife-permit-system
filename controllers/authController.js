const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db/index');
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');
console.log('Resend API Key loaded:', process.env.RESEND_API_KEY ? 'YES' : 'NO - MISSING');

const getLogin = (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('auth/login', { title: 'Login', layout: 'layouts/auth' });
};

const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            `SELECT u.*, r.name as role, r.permissions, rng.name as range_name
             FROM users u
             LEFT JOIN roles r ON u.role_id = r.id
             LEFT JOIN ranges rng ON u.range_id = rng.id
             WHERE u.email = $1 AND u.is_active = true`,
            [email]
        );
        const user = result.rows[0];
        if (!user) {
            req.session.error = 'Invalid email or password';
            return res.redirect('/login');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            req.session.error = 'Invalid email or password';
            return res.redirect('/login');
        }
        req.session.user = {
            id: user.id,
            uuid: user.uuid,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            role_id: user.role_id,
            range_id: user.range_id,
            range_name: user.range_name,
            permissions: user.permissions
        };
        if (user.first_login) {
            return res.redirect('/users/profile');
        }
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        req.session.error = 'Something went wrong. Please try again.';
        res.redirect('/login');
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

const getForgotPassword = (req, res) => {
    res.render('auth/forgot-password', { title: 'Forgot Password', layout: 'layouts/auth' });
};

const postForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );
        const user = result.rows[0];
        if (user) {
            const token = uuidv4();
            const expires = new Date(Date.now() + 3600000);
            await pool.query(
                'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
                [token, expires, email]
            );
            const resetUrl = `${process.env.APP_URL}/reset-password/${token}`;
            try {
                await resend.emails.send({
                    from: 'Wildlife Permit System <onboarding@resend.dev>',
                    to: email,
                    subject: 'Password Reset - Wildlife Permit System',
                    html: `
                        <h2>Password Reset Request</h2>
                        <p>Click the link below to reset your password. 
                           This link expires in 1 hour.</p>
                        <a href="${resetUrl}" style="background:#2E7D32;color:white;
                           padding:12px 24px;text-decoration:none;border-radius:5px;
                           display:inline-block;margin:10px 0;">
                           Reset My Password
                        </a>
                        <p>If you did not request this, please ignore this email.</p>
                        <p>Belize Forestry Department</p>
                    `
                });
                console.log('Password reset email sent to:', email);
            } catch (mailErr) {
                console.error('Email failed:', mailErr.message);
            }
        }
        req.session.success = 'If that email exists a reset link has been sent';
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.session.error = 'Something went wrong. Please try again.';
        res.redirect('/forgot-password');
    }
};

const getResetPassword = async (req, res) => {
    const { token } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
            [token]
        );
        if (!result.rows[0]) {
            req.session.error = 'Invalid or expired reset link';
            return res.redirect('/login');
        }
        res.render('auth/reset-password', {
            title: 'Reset Password',
            token,
            layout: 'layouts/auth'
        });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};

const postResetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
        req.session.error = 'Passwords do not match';
        return res.redirect(`/reset-password/${token}`);
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            `UPDATE users SET password = $1, reset_token = NULL,
             reset_token_expires = NULL WHERE reset_token = $2`,
            [hashedPassword, token]
        );
        req.session.success = 'Password reset successfully. Please login.';
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};

const getSetupAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE invite_token = $1 AND invite_token_expires > NOW()',
            [token]
        );
        if (!result.rows[0]) {
            req.session.error = 'Invalid or expired invite link';
            return res.redirect('/login');
        }
        res.render('auth/setup-account', {
            title: 'Setup Account',
            token,
            user: result.rows[0],
            layout: 'layouts/auth'
        });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};

const postSetupAccount = async (req, res) => {
    const { token } = req.params;
    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
        req.session.error = 'Passwords do not match';
        return res.redirect(`/setup-account/${token}`);
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            `UPDATE users SET password = $1, invite_token = NULL,
             invite_token_expires = NULL, first_login = false
             WHERE invite_token = $2`,
            [hashedPassword, token]
        );
        req.session.success = 'Account setup successfully. Please login.';
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};

module.exports = {
    getLogin,
    postLogin,
    logout,
    getForgotPassword,
    postForgotPassword,
    getResetPassword,
    postResetPassword,
    getSetupAccount,
    postSetupAccount
};