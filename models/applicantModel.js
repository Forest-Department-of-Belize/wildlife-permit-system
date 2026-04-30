const pool = require('../db/index');

const getAll = async (rangeId = null, search = null) => {
    let whereConditions = [];
    let params = [];
    let paramCount = 1;

    if (rangeId) {
    whereConditions.push(`a.range_id = $${paramCount}`);
    params.push(rangeId);
    paramCount++;
}

    if (search) {
        whereConditions.push(`(
            a.first_name ILIKE $${paramCount} OR
            a.last_name ILIKE $${paramCount} OR
            a.contact_number ILIKE $${paramCount} OR
            a.email ILIKE $${paramCount} OR
            a.government_id_number ILIKE $${paramCount} OR
            a.address1 ILIKE $${paramCount}
        )`);
        params.push(`%${search}%`);
        paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const result = await pool.query(
        `SELECT a.*, d.name as district_name,
         (SELECT COUNT(*) FROM permits p WHERE p.applicant_id = a.id) as permit_count,
         (SELECT COUNT(*) FROM parrots pr WHERE pr.applicant_id = a.id) as parrot_count
         FROM applicants a
         LEFT JOIN districts d ON a.district_id = d.id
         ${whereClause}
         ORDER BY a.last_name, a.first_name
         LIMIT 100`,
        params
    );
    return result.rows;
};

const findByUuid = async (uuid) => {
    const result = await pool.query(
        `SELECT a.*, d.name as district_name
         FROM applicants a
         LEFT JOIN districts d ON a.district_id = d.id
         WHERE a.uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

const getParrots = async (applicantId) => {
    const result = await pool.query(
        `SELECT p.*, ps.common_name as species_name
         FROM parrots p
         LEFT JOIN parrot_species ps ON p.species_id = ps.id
         WHERE p.applicant_id = $1
         ORDER BY p.created_at DESC`,
        [applicantId]
    );
    return result.rows;
};

const getPermits = async (applicantId) => {
    const result = await pool.query(
        `SELECT p.*, r.name as range_name
         FROM permits p
         LEFT JOIN ranges r ON p.range_id = r.id
         WHERE p.applicant_id = $1
         ORDER BY p.created_at DESC`,
        [applicantId]
    );
    return result.rows;
};

const getApplications = async (applicantId) => {
    const result = await pool.query(
        `SELECT a.*, r.name as range_name
         FROM applications a
         LEFT JOIN ranges r ON a.range_id = r.id
         WHERE a.applicant_id = $1
         ORDER BY a.created_at DESC`,
        [applicantId]
    );
    return result.rows;
};

const getInspections = async (applicantId) => {
    const result = await pool.query(
        `SELECT i.*, u.first_name || ' ' || u.last_name as inspector_name
         FROM inspections i
         LEFT JOIN users u ON i.inspector_id = u.id
         WHERE i.applicant_id = $1
         ORDER BY i.inspection_date DESC`,
        [applicantId]
    );
    return result.rows;
};

const getCalls = async (applicantId) => {
    const result = await pool.query(
        `SELECT c.*, u.first_name || ' ' || u.last_name as officer_name
         FROM calls c
         LEFT JOIN users u ON c.officer_id = u.id
         WHERE c.applicant_id = $1
         ORDER BY c.call_date DESC`,
        [applicantId]
    );
    return result.rows;
};

const getOffenses = async (applicantId) => {
    const result = await pool.query(
        `SELECT co.*, u.first_name || ' ' || u.last_name as officer_name,
         r.name as range_name
         FROM compound_offenses co
         LEFT JOIN users u ON co.officer_id = u.id
         LEFT JOIN ranges r ON co.range_id = r.id
         WHERE co.applicant_id = $1
         ORDER BY co.offense_date DESC`,
        [applicantId]
    );
    return result.rows;
};

const create = async (data) => {
    const result = await pool.query(
        `INSERT INTO applicants (
            first_name, middle_name, last_name, date_of_birth,
            address1, address2, district_id, range_id, contact_number,
            contact_number_whatsapp, contact_number_secondary,
            contact_number_secondary_whatsapp, email, occupation,
            company, government_id_type, government_id_number,
            applicant_status, info_source, parrot_diet, enclosure_type,
            cage_location, cage_size_feet, shared_separate,
            does_fly_free, fly_free_when, are_wings_cut,
            applicant_comments, ownership_comments
        ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
            $15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29
        ) RETURNING *`,
        [
            data.first_name, data.middle_name, data.last_name,
            data.date_of_birth || null, data.address1, data.address2,
            data.district_id || null, data.range_id || null,
            data.contact_number,
            data.contact_number_whatsapp === 'on',
            data.contact_number_secondary,
            data.contact_number_secondary_whatsapp === 'on',
            data.email, data.occupation, data.company,
            data.government_id_type, data.government_id_number,
            data.applicant_status, data.info_source,
            data.parrot_diet, data.enclosure_type, data.cage_location,
            data.cage_size_feet, data.shared_separate,
            data.does_fly_free === 'on',
            data.fly_free_when, data.are_wings_cut === 'on',
            data.applicant_comments, data.ownership_comments
        ]
    );
    return result.rows[0];
};

const update = async (uuid, data) => {
    const result = await pool.query(
        `UPDATE applicants SET
            first_name=$1, middle_name=$2, last_name=$3,
            date_of_birth=$4, address1=$5, address2=$6,
            district_id=$7, contact_number=$8,
            contact_number_whatsapp=$9, contact_number_secondary=$10,
            contact_number_secondary_whatsapp=$11, email=$12,
            occupation=$13, company=$14, government_id_type=$15,
            government_id_number=$16, applicant_status=$17,
            parrot_diet=$18, enclosure_type=$19, cage_location=$20,
            cage_size_feet=$21, shared_separate=$22,
            does_fly_free=$23, fly_free_when=$24,
            are_wings_cut=$25, applicant_comments=$26,
            ownership_comments=$27, updated_at=NOW()
         WHERE uuid=$28 RETURNING *`,
        [
            data.first_name, data.middle_name, data.last_name,
            data.date_of_birth || null, data.address1, data.address2,
            data.district_id || null, data.contact_number,
            data.contact_number_whatsapp === 'on',
            data.contact_number_secondary,
            data.contact_number_secondary_whatsapp === 'on',
            data.email, data.occupation, data.company,
            data.government_id_type, data.government_id_number,
            data.applicant_status, data.parrot_diet,
            data.enclosure_type, data.cage_location,
            data.cage_size_feet, data.shared_separate,
            data.does_fly_free === 'on', data.fly_free_when,
            data.are_wings_cut === 'on', data.applicant_comments,
            data.ownership_comments, uuid
        ]
    );
    return result.rows[0];
};

const search = async (query, rangeId = null) => {
    const searchQuery = `%${query}%`;
    const result = await pool.query(
        `SELECT a.*, d.name as district_name
         FROM applicants a
         LEFT JOIN districts d ON a.district_id = d.id
         WHERE (
             a.first_name ILIKE $1 OR
             a.last_name ILIKE $1 OR
             a.email ILIKE $1 OR
             a.contact_number ILIKE $1 OR
             a.government_id_number ILIKE $1
         )
         ORDER BY a.last_name, a.first_name
         LIMIT 50`,
        [searchQuery]
    );
    return result.rows;
};
const remove = async (uuid) => {
    await pool.query(
        'DELETE FROM applicants WHERE uuid = $1',
        [uuid]
    );
};

module.exports = {
    getAll, findByUuid, getParrots, getPermits,
    getApplications, getInspections, getCalls,
    getOffenses, create, update, search, remove
};