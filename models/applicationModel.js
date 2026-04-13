const pool = require('../db/index');

const getAll = async (rangeId = null) => {
    const query = rangeId
        ? `SELECT ap.*, 
           a.first_name || ' ' || a.last_name as applicant_name,
           a.uuid as applicant_uuid,
           r.name as range_name
           FROM applications ap
           LEFT JOIN applicants a ON ap.applicant_id = a.id
           LEFT JOIN ranges r ON ap.range_id = r.id
           WHERE ap.range_id = $1
           ORDER BY ap.created_at DESC`
        : `SELECT ap.*,
           a.first_name || ' ' || a.last_name as applicant_name,
           a.uuid as applicant_uuid,
           r.name as range_name
           FROM applications ap
           LEFT JOIN applicants a ON ap.applicant_id = a.id
           LEFT JOIN ranges r ON ap.range_id = r.id
           ORDER BY ap.created_at DESC`;

    const result = await pool.query(query, rangeId ? [rangeId] : []);
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT ap.*,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid,
         r.name as range_name
         FROM applications ap
         LEFT JOIN applicants a ON ap.applicant_id = a.id
         LEFT JOIN ranges r ON ap.range_id = r.id
         WHERE ap.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO applications (
            applicant_id, range_id, info_source, application_status,
            application_date, date_received, reference_number,
            application_signed, followup_done, followup_details,
            applied_previously, applied_previously_date,
            previously_approved, application_experience,
            application_comments
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING *`,
        [
            data.applicant_id, data.range_id, data.info_source,
            data.application_status, data.application_date || null,
            data.date_received || null, data.reference_number,
            data.application_signed === 'on',
            data.followup_done === 'on', data.followup_details,
            data.applied_previously === 'on',
            data.applied_previously_date || null,
            data.previously_approved === 'on',
            data.application_experience, data.application_comments
        ]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE applications SET
            range_id=$1, application_status=$2,
            application_date=$3, date_received=$4,
            reference_number=$5, application_signed=$6,
            followup_done=$7, followup_details=$8,
            applied_previously=$9, applied_previously_date=$10,
            previously_approved=$11, application_experience=$12,
            application_comments=$13, updated_at=NOW()
         WHERE uuid=$14 RETURNING *`,
        [
            data.range_id, data.application_status,
            data.application_date || null, data.date_received || null,
            data.reference_number, data.application_signed === 'on',
            data.followup_done === 'on', data.followup_details,
            data.applied_previously === 'on',
            data.applied_previously_date || null,
            data.previously_approved === 'on',
            data.application_experience, data.application_comments, uuid
        ]
    );
    return result.rows[0];
};

module.exports = { getAll, findByUuid, create, update };