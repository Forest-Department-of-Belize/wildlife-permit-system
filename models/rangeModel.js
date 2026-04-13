const pool = require('../db/index');

const getAll = async () => {
    const result = await pool.query(
        `SELECT r.*, d.name as district_name
         FROM ranges r
         LEFT JOIN districts d ON r.district_id = d.id
         ORDER BY r.name`
    );
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT r.*, d.name as district_name
         FROM ranges r
         LEFT JOIN districts d ON r.district_id = d.id
         WHERE r.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO ranges (name, district_id)
         VALUES ($1, $2) RETURNING *`,
        [data.name, data.district_id || null]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE ranges SET name=$1, district_id=$2, updated_at=NOW()
         WHERE uuid=$3 RETURNING *`,
        [data.name, data.district_id || null, uuid]
    );
    return result.rows[0];
};

const getStats = async (rangeId) => {
    const result = await pool.query(
        `SELECT
         (SELECT COUNT(*) FROM permits WHERE range_id = $1) as total_permits,
         (SELECT COUNT(*) FROM permits WHERE range_id = $1 AND status = 'Active') as active_permits,
         (SELECT COUNT(*) FROM inspections WHERE range_id = $1) as total_inspections,
         (SELECT COUNT(*) FROM inspections WHERE range_id = $1 AND inspection_status = 'scheduled') as pending_inspections`,
        [rangeId]
    );
    return result.rows[0];
};

module.exports = { getAll, findByUuid, create, update, getStats };