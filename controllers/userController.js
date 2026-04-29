const userModel = require('../models/userModel');
const rangeModel = require('../models/rangeModel');
const roleModel = require('../models/roleModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { getRangeFilter } = require('../middleware/rangeFilter');
require('dotenv').config();
const pool = require('../db/index');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const users = await userModel.getAll(rangeId);
        res.render('users/index', {
            title: 'Users',
            users
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const user = await userModel.findByUuid(req.params.uuid);
        if (!user) {
            req.session.error = 'User not found';
            return res.redirect('/users');
        }
        res.render('users/view', {
            title: 'View User',
            viewUser: user
        });
    } catch (err) {
        console.error(err);
        res.redirect('/users');
    }
};

const create = async (req, res) => {
    try {
        const [ranges, roles] = await Promise.all([
            rangeModel.getAll(),
            getRoles()
        ]);
        res.render('users/create', {
            title: 'Add New User',
            ranges,
            roles
        });
    } catch (err) {
        console.error(err);
        res.redirect('/users');
    }
};

const getRoles = async () => {
    const pool = require('../db/index');
    const result = await pool.query('SELECT * FROM roles ORDER BY name');
    return result.rows;
};

const store = async (req, res) => {
    try {
        const token = uuidv4();
        const expires = new Date(Date.now() + 48 * 3600000);

        const newUser = await userModel.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            role_id: req.body.role_id,
            range_id: req.body.range_id || null,
            invite_token: token,
            invite_token_expires: expires
        });

        const setupUrl = `${process.env.APP_URL}/setup-account/${token}`;

        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: req.body.email,
            subject: 'You have been invited to Wildlife Permit System',
            html: `
                <h2>Welcome to the Wildlife Permit System</h2>
                <p>Hello ${req.body.first_name},</p>
                <p>You have been invited to access the Belize Forestry Department 
                   Wildlife Permit Management System.</p>
                <p>Click the link below to set up your account. 
                   This link expires in 48 hours.</p>
                <a href="${setupUrl}" style="background:#2E7D32;color:white;
                   padding:12px 24px;text-decoration:none;border-radius:5px;
                   display:inline-block;margin:10px 0;">
                   Set Up My Account
                </a>
                <p>If you did not expect this invitation, please ignore this email.</p>
                <p>Belize Forestry Department</p>
            `
        });

        console.log('Invitation email sent to:', req.body.email);
        req.session.success = `Invitation sent to ${req.body.email}`;
        res.redirect('/users');

    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            req.session.error = 'A user with that email address already exists';
        } else {
            req.session.error = 'Failed to create user. Please try again.';
        }
        res.redirect('/users/create');
    }
};

const edit = async (req, res) => {
    try {
        const editUser = await userModel.findByUuid(req.params.uuid);
        if (!editUser) {
            req.session.error = 'User not found';
            return res.redirect('/users');
        }
        const [ranges, roles] = await Promise.all([
            rangeModel.getAll(),
            getRoles()
        ]);
        res.render('users/edit', {
            title: 'Edit User',
            editUser,
            ranges,
            roles
        });
    } catch (err) {
        console.error(err);
        res.redirect('/users');
    }
};

const update = async (req, res) => {
    try {
        await userModel.update(req.params.uuid, req.body);
        req.session.success = 'User updated successfully';
        res.redirect(`/users/${req.params.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update user';
        res.redirect(`/users/${req.params.uuid}/edit`);
    }
};

const profile = async (req, res) => {
    try {
        const profileUser = await userModel.findByUuid(req.session.user.uuid);
        res.render('users/profile', {
            title: 'My Profile',
            profileUser
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const updateProfile = async (req, res) => {
    try {
        const { current_password, new_password, confirm_password } = req.body;

        if (new_password) {
            if (new_password !== confirm_password) {
                req.session.error = 'New passwords do not match';
                return res.redirect('/users/profile');
            }
            const pool = require('../db/index');
            const result = await pool.query(
                'SELECT password FROM users WHERE uuid = $1',
                [req.session.user.uuid]
            );
            const valid = await bcrypt.compare(current_password, result.rows[0].password);
            if (!valid) {
                req.session.error = 'Current password is incorrect';
                return res.redirect('/users/profile');
            }
            const hashed = await bcrypt.hash(new_password, 10);
            await userModel.updatePassword(req.session.user.id, hashed);
        }

        await userModel.update(req.session.user.uuid, req.body);
        req.session.user.first_name = req.body.first_name;
        req.session.user.last_name = req.body.last_name;

        req.session.success = 'Profile updated successfully';
        res.redirect('/users/profile');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update profile';
        res.redirect('/users/profile');
    }
};

const resendInvite = async (req, res) => {
    try {
        const inviteUser = await userModel.findByUuid(req.params.uuid);
        if (!inviteUser) {
            req.session.error = 'User not found';
            return res.redirect('/users');
        }

        const token = uuidv4();
        const expires = new Date(Date.now() + 48 * 3600000);
        await userModel.updateInviteToken(inviteUser.id, token, expires);

        const setupUrl = `${process.env.APP_URL}/setup-account/${token}`;

        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: inviteUser.email,
            subject: 'Your Wildlife Permit System Invitation',
            html: `
                <h2>Account Setup - Wildlife Permit System</h2>
                <p>Hello ${inviteUser.first_name},</p>
                <p>Here is your updated invitation link to set up your account.</p>
                <a href="${setupUrl}">Set Up My Account</a>
                <p>This link expires in 48 hours.</p>
            `
        });

        console.log('Invite resent to:', inviteUser.email);
        req.session.success = 'Invitation resent successfully';
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to resend invitation';
        res.redirect('/users');
    }
};

const deactivate = async (req, res) => {
    try {
        const deactivateUser = await userModel.findByUuid(req.params.uuid);
        if (!deactivateUser) {
            req.session.error = 'User not found';
            return res.redirect('/users');
        }

        await pool.query(
            'UPDATE users SET is_active = false WHERE uuid = $1',
            [req.params.uuid]
        );

        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: deactivateUser.email,
            subject: 'Your Wildlife Permit System Account Has Been Deactivated',
            html: `
                <h2>Account Deactivated</h2>
                <p>Hello ${deactivateUser.first_name},</p>
                <p>Your account on the Belize Forestry Department Wildlife Permit 
                   Management System has been deactivated by an administrator.</p>
                <p>If you believe this was done in error please contact your 
                   supervisor or the Wildlife Program Manager.</p>
                <p>Belize Forestry Department</p>
            `
        });

        console.log('Account deactivated:', deactivateUser.email);
        req.session.success = `${deactivateUser.first_name} ${deactivateUser.last_name}'s account has been deactivated`;
        res.redirect('/users');

    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to deactivate user';
        res.redirect('/users');
    }
};

const reactivate = async (req, res) => {
    try {
        const reactivateUser = await userModel.findByUuid(req.params.uuid);
        if (!reactivateUser) {
            req.session.error = 'User not found';
            return res.redirect('/users');
        }

        await pool.query(
            'UPDATE users SET is_active = true WHERE uuid = $1',
            [req.params.uuid]
        );

        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: reactivateUser.email,
            subject: 'Your Wildlife Permit System Account Has Been Reactivated',
            html: `
                <h2>Account Reactivated</h2>
                <p>Hello ${reactivateUser.first_name},</p>
                <p>Your account on the Belize Forestry Department Wildlife Permit 
                   Management System has been reactivated.</p>
                <p>You can now log in at: <a href="${process.env.APP_URL}">${process.env.APP_URL}</a></p>
                <p>Belize Forestry Department</p>
            `
        });

        console.log('Account reactivated:', reactivateUser.email);
        req.session.success = `${reactivateUser.first_name} ${reactivateUser.last_name}'s account has been reactivated`;
        res.redirect('/users');

    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to reactivate user';
        res.redirect('/users');
    }
};

module.exports = {
    index, view, create, store, edit,
    update, profile, updateProfile, resendInvite,
    deactivate, reactivate
};