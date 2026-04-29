const pool = require('../db/index');

const getAll = async (rangeId = null, search = null) => {
    let whereConditions = [];
    let params = [];
    let paramCount = 1;

    if (rangeId) {
        whereConditions.push(`p.range_id = $${paramCount}`);
        params.push(rangeId);
        paramCount++;
    }

    if (search) {
        whereConditions.push(`(
            p.permit_number ILIKE $${paramCount} OR
            p.reference_number ILIKE $${paramCount} OR
            a.first_name ILIKE $${paramCount} OR
            a.last_name ILIKE $${paramCount}
        )`);
        params.push(`%${search}%`);
        paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const result = await pool.query(
        `SELECT p.*,
         a.first_name || ' ' || a.last_name as applicant_name,
         r.name as range_name
         FROM permits p
         LEFT JOIN applicants a ON p.applicant_id = a.id
         LEFT JOIN ranges r ON p.range_id = r.id
         ${whereClause}
         ORDER BY p.created_at DESC
         LIMIT 100`,
        params
    );
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT p.*,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid,
         r.name as range_name
         FROM permits p
         LEFT JOIN applicants a ON p.applicant_id = a.id
         LEFT JOIN ranges r ON p.range_id = r.id
         WHERE p.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO permits (
            applicant_id, range_id, permit_number, reference_number,
            application_date, issue_date, number_of_pets, status,
            housing, picture_url, permit_comments, info_source
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *`,
        [
            data.applicant_id, data.range_id, data.permit_number,
            data.reference_number, data.application_date || null,
            data.issue_date || null, data.number_of_pets || 0,
            data.status || 'Processing', data.housing,
            data.picture_url, data.permit_comments, data.info_source
        ]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE permits SET
            permit_number=$1, reference_number=$2,
            application_date=$3, issue_date=$4,
            range_id=$5, number_of_pets=$6,
            status=$7, housing=$8, picture_url=$9,
            permit_comments=$10, updated_at=NOW()
         WHERE uuid=$11 RETURNING *`,
        [
            data.permit_number, data.reference_number,
            data.application_date || null, data.issue_date || null,
            data.range_id, data.number_of_pets || 0,
            data.status, data.housing, data.picture_url,
            data.permit_comments, uuid
        ]
    );
    return result.rows[0];
};

module.exports = { getAll, findByUuid, create, update };