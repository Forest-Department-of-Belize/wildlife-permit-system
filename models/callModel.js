const pool = require('../db/index');

const getAll = async (rangeId = null) => {
    const result = await pool.query(
        `SELECT c.*,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid,
         u.first_name || ' ' || u.last_name as officer_name
         FROM calls c
         LEFT JOIN applicants a ON c.applicant_id = a.id
         LEFT JOIN users u ON c.officer_id = u.id
         ORDER BY c.call_date DESC`
    );
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT c.*,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid,
         u.first_name || ' ' || u.last_name as officer_name
         FROM calls c
         LEFT JOIN applicants a ON c.applicant_id = a.id
         LEFT JOIN users u ON c.officer_id = u.id
         WHERE c.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO calls (
            applicant_id, officer_id, number_called, call_date,
            language, is_functional, is_answered, is_applicant,
            know_applicant, relation_applicant, call_now_consent,
            call_later_consent, call_later_date, is_fully_completed,
            scheduled_followup, followup_date,
            consents_digital_resources, num_neighbors_parrots,
            neighborhood_description, call_comments
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
        RETURNING *`,
        [
            data.applicant_id, data.officer_id, data.number_called,
            data.call_date || null, data.language,
            data.is_functional === 'on', data.is_answered === 'on',
            data.is_applicant === 'on', data.know_applicant === 'on',
            data.relation_applicant, data.call_now_consent === 'on',
            data.call_later_consent === 'on',
            data.call_later_date || null,
            data.is_fully_completed === 'on',
            data.scheduled_followup === 'on',
            data.followup_date || null,
            data.consents_digital_resources === 'on',
            data.num_neighbors_parrots || null,
            data.neighborhood_description, data.call_comments
        ]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE calls SET
            number_called=$1, call_date=$2, language=$3,
            is_functional=$4, is_answered=$5, is_applicant=$6,
            know_applicant=$7, relation_applicant=$8,
            call_now_consent=$9, call_later_consent=$10,
            call_later_date=$11, is_fully_completed=$12,
            scheduled_followup=$13, followup_date=$14,
            consents_digital_resources=$15,
            num_neighbors_parrots=$16,
            neighborhood_description=$17, call_comments=$18,
            updated_at=NOW()
         WHERE uuid=$19 RETURNING *`,
        [
            data.number_called, data.call_date || null, data.language,
            data.is_functional === 'on', data.is_answered === 'on',
            data.is_applicant === 'on', data.know_applicant === 'on',
            data.relation_applicant, data.call_now_consent === 'on',
            data.call_later_consent === 'on',
            data.call_later_date || null,
            data.is_fully_completed === 'on',
            data.scheduled_followup === 'on',
            data.followup_date || null,
            data.consents_digital_resources === 'on',
            data.num_neighbors_parrots || null,
            data.neighborhood_description, data.call_comments, uuid
        ]
    );
    return result.rows[0];
};

module.exports = { getAll, findByUuid, create, update };