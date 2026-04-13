const pool = require('../db/index');

const getAll = async () => {
    const result = await pool.query(
        `SELECT * FROM districts ORDER BY name`
    );
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT * FROM districts WHERE uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO districts (name) VALUES ($1) RETURNING *`,
        [data.name]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE districts SET name=$1, updated_at=NOW()
         WHERE uuid=$2 RETURNING *`,
        [data.name, uuid]
    );
    return result.rows[0];
};

module.exports = { getAll, findByUuid, create, update };