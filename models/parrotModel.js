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
            p.band_number ILIKE $${paramCount} OR
            p.pet_name ILIKE $${paramCount} OR
            ps.common_name ILIKE $${paramCount} OR
            a.first_name ILIKE $${paramCount} OR
            a.last_name ILIKE $${paramCount}
        )`);
        params.push(`%${search}%`);
        paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const result = await pool.query(
        `SELECT p.*, ps.common_name as species_name,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid
         FROM parrots p
         LEFT JOIN parrot_species ps ON p.species_id = ps.id
         LEFT JOIN applicants a ON p.applicant_id = a.id
         ${whereClause}
         ORDER BY p.created_at DESC
         LIMIT 100`,
        params
    );
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT p.*, ps.common_name as species_name,
         a.first_name || ' ' || a.last_name as applicant_name,
         a.uuid as applicant_uuid
         FROM parrots p
         LEFT JOIN parrot_species ps ON p.species_id = ps.id
         LEFT JOIN applicants a ON p.applicant_id = a.id
         WHERE p.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO parrots (
            applicant_id, species_id, permit_id, range_id,
            band_number, pet_name, sex, parrot_age_months,
            method_obtained, period_of_ownership_months,
            housing_details, has_parrot, why_no_parrot,
            is_healthy, health_comments, stories, bird_comments,
            info_source, eri_bird_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
        RETURNING *`,
        [
            data.applicant_id, data.species_id || null,
            data.permit_id || null, data.range_id || null,
            data.band_number, data.pet_name, data.sex,
            data.parrot_age_months || null, data.method_obtained,
            data.period_of_ownership_months || null,
            data.housing_details, data.has_parrot,
            data.why_no_parrot, data.is_healthy === 'on',
            data.health_comments, data.stories,
            data.bird_comments, data.info_source, data.eri_bird_id
        ]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE parrots SET
            species_id=$1, band_number=$2, pet_name=$3,
            sex=$4, parrot_age_months=$5, method_obtained=$6,
            period_of_ownership_months=$7, housing_details=$8,
            has_parrot=$9, why_no_parrot=$10, is_healthy=$11,
            health_comments=$12, stories=$13, bird_comments=$14,
            updated_at=NOW()
         WHERE uuid=$15 RETURNING *`,
        [
            data.species_id || null, data.band_number, data.pet_name,
            data.sex, data.parrot_age_months || null,
            data.method_obtained, data.period_of_ownership_months || null,
            data.housing_details, data.has_parrot, data.why_no_parrot,
            data.is_healthy === 'on', data.health_comments,
            data.stories, data.bird_comments, uuid
        ]
    );
    return result.rows[0];
};

module.exports = { getAll, findByUuid, create, update };