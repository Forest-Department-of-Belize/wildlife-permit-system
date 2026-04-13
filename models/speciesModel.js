const pool = require('../db/index');

const getAll = async () => {
    const result = await pool.query(
        `SELECT * FROM parrot_species ORDER BY common_name`
    );
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT * FROM parrot_species WHERE uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO parrot_species (common_name, scientific_name)
         VALUES ($1, $2) RETURNING *`,
        [data.common_name, data.scientific_name]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE parrot_species SET
         common_name=$1, scientific_name=$2, updated_at=NOW()
         WHERE uuid=$3 RETURNING *`,
        [data.common_name, data.scientific_name, uuid]
    );
    return result.rows[0];
};

module.exports = { getAll, findByUuid, create, update };