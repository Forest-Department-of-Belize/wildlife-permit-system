const pool = require('../db/index');

const getAll = async () => {
    const result = await pool.query(
        `SELECT * FROM roles ORDER BY name`
    );
    return result.rows;
};

const findById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM roles WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO roles (name, permissions)
         VALUES ($1, $2) RETURNING *`,
        [data.name, JSON.stringify(data.permissions || [])]
    );
    return result.rows[0];
};

const update = async (id, data) => {
    const result = await pool.query(
        `UPDATE roles SET name=$1, permissions=$2, updated_at=NOW()
         WHERE id=$3 RETURNING *`,
        [data.name, JSON.stringify(data.permissions || []), id]
    );
    return result.rows[0];
};

module.exports = { getAll, findById, create, update };