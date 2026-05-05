const pool = require('../db/index');

const getAll = async (rangeId = null, search = null) => {
    let whereConditions = [];
    let params = [];
    let paramCount = 1;

    if (rangeId) {
        whereConditions.push(`i.range_id = $${paramCount}`);
        params.push(rangeId);
        paramCount++;
    }

    if (search) {
        whereConditions.push(`(
            a.first_name ILIKE $${paramCount} OR
            a.last_name ILIKE $${paramCount} OR
            i.inspection_status ILIKE $${paramCount} OR
            i.inspector_name ILIKE $${paramCount}
        )`);
        params.push(`%${search}%`);
        paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const result = await pool.query(
        `SELECT i.*,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid
         FROM inspections i
         LEFT JOIN applicants a ON i.applicant_id = a.id
         ${whereClause}
         ORDER BY i.inspection_date DESC
         LIMIT 100`,
        params
    );
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT i.*,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid,
         r.name as range_name
         FROM inspections i
         LEFT JOIN applicants a ON i.applicant_id = a.id
         LEFT JOIN ranges r ON i.range_id = r.id
         WHERE i.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO inspections (
            applicant_id, inspector_name, range_id,
            inspection_date, inspection_status, notes,
            followup_date, followup_notes, birds_described,
            hand_tame, instructions_for_applicant, expected_recheck,
            preconditions_comments
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *`,
        [
            data.applicant_id, data.inspector_name, data.range_id,
            data.inspection_date, data.inspection_status || 'scheduled',
            data.notes, data.followup_date || null,
            data.followup_notes, data.birds_described,
            data.hand_tame === 'on', data.instructions_for_applicant,
            data.expected_recheck || null, data.preconditions_comments
        ]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE inspections SET
            inspection_date=$1, inspector_name=$2,
            inspection_status=$3, notes=$4,
            followup_date=$5, followup_notes=$6,
            birds_described=$7, hand_tame=$8,
            instructions_for_applicant=$9,
            expected_recheck=$10, preconditions_comments=$11,
            updated_at=NOW()
         WHERE uuid=$12 RETURNING *`,
        [
            data.inspection_date, data.inspector_name,
            data.inspection_status, data.notes,
            data.followup_date || null, data.followup_notes,
            data.birds_described, data.hand_tame === 'on',
            data.instructions_for_applicant,
            data.expected_recheck || null,
            data.preconditions_comments, uuid
        ]
    );
    return result.rows[0];
};

const confiscateParrots = async (inspectionId, parrotIds) => {
    await pool.query(
        `UPDATE parrots SET confiscated = false, inspection_id = NULL
         WHERE inspection_id = $1`,
        [inspectionId]
    );
    if (parrotIds && parrotIds.length > 0) {
        await pool.query(
            `UPDATE parrots SET confiscated = true, inspection_id = $1
             WHERE id = ANY($2::int[])`,
            [inspectionId, parrotIds]
        );
    }
};

module.exports = { getAll, findByUuid, create, update, confiscateParrots };