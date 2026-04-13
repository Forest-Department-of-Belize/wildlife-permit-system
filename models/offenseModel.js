const pool = require('../db/index');

const getAll = async (rangeId = null) => {
    const query = rangeId
        ? `SELECT co.*,
           a.first_name || ' ' || a.last_name as applicant_name,
           a.uuid as applicant_uuid,
           u.first_name || ' ' || u.last_name as officer_name,
           r.name as range_name
           FROM compound_offenses co
           LEFT JOIN applicants a ON co.applicant_id = a.id
           LEFT JOIN users u ON co.officer_id = u.id
           LEFT JOIN ranges r ON co.range_id = r.id
           WHERE co.range_id = $1
           ORDER BY co.offense_date DESC`
        : `SELECT co.*,
           a.first_name || ' ' || a.last_name as applicant_name,
           a.uuid as applicant_uuid,
           u.first_name || ' ' || u.last_name as officer_name,
           r.name as range_name
           FROM compound_offenses co
           LEFT JOIN applicants a ON co.applicant_id = a.id
           LEFT JOIN users u ON co.officer_id = u.id
           LEFT JOIN ranges r ON co.range_id = r.id
           ORDER BY co.offense_date DESC`;

    const result = await pool.query(query, rangeId ? [rangeId] : []);
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT co.*,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid,
         u.first_name || ' ' || u.last_name as officer_name,
         r.name as range_name
         FROM compound_offenses co
         LEFT JOIN applicants a ON co.applicant_id = a.id
         LEFT JOIN users u ON co.officer_id = u.id
         LEFT JOIN ranges r ON co.range_id = r.id
         WHERE co.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO compound_offenses (
            applicant_id, officer_id, range_id, offense_date,
            illegal_wildlife, hand_tame, date_acquired,
            prior_history, health_issues, diet_notes,
            cage_size_feet, cage_confiscated, cage_location,
            reason_confiscated, signed_officer, signed_offender,
            signed_date, offense_comments
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
        RETURNING *`,
        [
            data.applicant_id, data.officer_id, data.range_id,
            data.offense_date || null, data.illegal_wildlife,
            data.hand_tame === 'on', data.date_acquired || null,
            data.prior_history === 'on', data.health_issues,
            data.diet_notes, data.cage_size_feet,
            data.cage_confiscated === 'on', data.cage_location,
            data.reason_confiscated, data.signed_officer === 'on',
            data.signed_offender === 'on',
            data.signed_date || null, data.offense_comments
        ]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE compound_offenses SET
            offense_date=$1, illegal_wildlife=$2,
            hand_tame=$3, date_acquired=$4, prior_history=$5,
            health_issues=$6, diet_notes=$7, cage_size_feet=$8,
            cage_confiscated=$9, cage_location=$10,
            reason_confiscated=$11, signed_officer=$12,
            signed_offender=$13, signed_date=$14,
            offense_comments=$15, updated_at=NOW()
         WHERE uuid=$16 RETURNING *`,
        [
            data.offense_date || null, data.illegal_wildlife,
            data.hand_tame === 'on', data.date_acquired || null,
            data.prior_history === 'on', data.health_issues,
            data.diet_notes, data.cage_size_feet,
            data.cage_confiscated === 'on', data.cage_location,
            data.reason_confiscated, data.signed_officer === 'on',
            data.signed_offender === 'on',
            data.signed_date || null, data.offense_comments, uuid
        ]
    );
    return result.rows[0];
};

module.exports = { getAll, findByUuid, create, update };