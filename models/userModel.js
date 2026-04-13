const pool = require('../db/index');

const findByEmail = async (email) => {
    const result = await pool.query(
        `SELECT u.*, r.name as role, r.permissions, rng.name as range_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         LEFT JOIN ranges rng ON u.range_id = rng.id
         WHERE u.email = $1`,
        [email]
    );
    return result.rows[0];
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT u.*, r.name as role, r.permissions, rng.name as range_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         LEFT JOIN ranges rng ON u.range_id = rng.id
         WHERE u.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const findByInviteToken = async (token) => {
    const result = await pool.query(
        `SELECT * FROM users 
         WHERE invite_token = $1 
         AND invite_token_expires > NOW()`,
        [token]
    );
    return result.rows[0];
};

const findByResetToken = async (token) => {
    const result = await pool.query(
        `SELECT * FROM users 
         WHERE reset_token = $1 
         AND reset_token_expires > NOW()`,
        [token]
    );
    return result.rows[0];
};

const getAll = async (rangeId = null) => {
    const query = rangeId
        ? `SELECT u.*, r.name as role, rng.name as range_name
           FROM users u
           LEFT JOIN roles r ON u.role_id = r.id
           LEFT JOIN ranges rng ON u.range_id = rng.id
           WHERE u.range_id = $1
           ORDER BY u.first_name`
        : `SELECT u.*, r.name as role, rng.name as range_name
           FROM users u
           LEFT JOIN roles r ON u.role_id = r.id
           LEFT JOIN ranges rng ON u.range_id = rng.id
           ORDER BY u.first_name`;

    const result = await pool.query(query, rangeId ? [rangeId] : []);
    return result.rows;
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO users 
         (first_name, last_name, email, role_id, range_id, invite_token, invite_token_expires, is_active, first_login)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, true)
         RETURNING *`,
        [data.first_name, data.last_name, data.email, data.role_id, data.range_id, data.invite_token, data.invite_token_expires]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE users SET
         first_name = $1, last_name = $2, email = $3,
         role_id = $4, range_id = $5, updated_at = NOW()
         WHERE uuid = $6 RETURNING *`,
        [data.first_name, data.last_name, data.email, data.role_id, data.range_id, uuid]
    );
    return result.rows[0];
};

const updatePassword = async (id, hashedPassword) => {
    await pool.query(
        `UPDATE users SET password = $1, first_login = false, 
         reset_token = NULL, reset_token_expires = NULL,
         updated_at = NOW() WHERE id = $2`,
        [hashedPassword, id]
    );
};

const updateInviteToken = async (id, token, expires) => {
    await pool.query(
        `UPDATE users SET invite_token = $1, invite_token_expires = $2 WHERE id = $3`,
        [token, expires, id]
    );
};

const updateResetToken = async (email, token, expires) => {
    await pool.query(
        `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3`,
        [token, expires, email]
    );
};

const deactivate = async (uuid) => {
    await pool.query(
        `UPDATE users SET is_active = false WHERE uuid = $1`,
        [uuid]
    );
};

module.exports = {
    findByEmail,
    findByUuid,
    findByInviteToken,
    findByResetToken,
    getAll,
    create,
    update,
    updatePassword,
    updateInviteToken,
    updateResetToken,
    deactivate
};