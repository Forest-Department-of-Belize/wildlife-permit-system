const pool = require('../db/index');
const XLSX = require('xlsx');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

const getImport = (req, res) => {
    res.render('import/index', { title: 'Import Data', results: null });
};

const postImport = async (req, res) => {
    const results = {
        districts: 0,
        ranges: 0,
        applicants: 0,
        applications: 0,
        permits: 0,
        parrots: 0,
        errors: []
    };

    try {
        const workbook = XLSX.readFile(req.file.path);

        // ── DISTRICTS ──
        const districtMap = {};
        const districtRows = await pool.query('SELECT id, name FROM districts');
        districtRows.rows.forEach(d => {
            districtMap[d.name.toLowerCase().trim()] = d.id;
        });

        // ── RANGES ──
        const rangeMap = {};
        const rangeRows = await pool.query('SELECT id, name FROM ranges');
        rangeRows.rows.forEach(r => {
            rangeMap[r.name.toLowerCase().trim()] = r.id;
            // Also map short names from Excel
            const short = r.name.toLowerCase().replace(' forest station', '').replace(' headquarters', '').trim();
            rangeMap[short] = r.id;
        });

        // Add extra range mappings from Excel data
        const rangeAliases = {
            'belmopan': 'belmopan headquarters',
            'san ignacio': 'san ignacio forest station',
            'sanig': 'san ignacio forest station',
            'orange walk': 'orange walk forest station',
            'ow': 'orange walk forest station',
            'machaca': 'machaca forest station',
            'savanna': 'savanna forest station',
            'douglas': 'douglas d silva forest station',
            'dsf': 'douglas d silva forest station',
        };

        // ── APPLICANTS ──
        const applicantSheet = workbook.Sheets['Applicants'];
        if (applicantSheet) {
            const applicants = XLSX.utils.sheet_to_json(applicantSheet);
            const applicantEriMap = {};

            for (const row of applicants) {
                try {
                    const firstName = row.first_name && row.first_name !== 'MISSING' ? String(row.first_name).trim() : null;
                    const lastName = row.last_name && row.last_name !== 'MISSING' ? String(row.last_name).trim() : null;

                    if (!firstName || !lastName) continue;

                    const districtName = row.district ? String(row.district).toLowerCase().trim() : null;
                    const districtId = districtName ? districtMap[districtName] || null : null;

                    const contactNum = row.contact_number && row.contact_number !== 'MISSING'
                        ? String(row.contact_number).trim() : null;
                    const email = row.email && row.email !== 'MISSING'
                        ? String(row.email).trim() : null;
                    const occupation = row.occupation && row.occupation !== 'MISSING'
                        ? String(row.occupation).trim() : null;
                    const address1 = row.address1 && row.address1 !== 'MISSING'
                        ? String(row.address1).trim() : null;
                    const address2 = row.address2 && row.address2 !== 'MISSING'
                        ? String(row.address2).trim() : null;
                    const comments = row.applicant_comments && row.applicant_comments !== 'MISSING' && row.applicant_comments !== 'NA'
                        ? String(row.applicant_comments).trim() : null;

                    let dob = null;
                    if (row.date_of_birth && row.date_of_birth !== 'MISSING') {
                        try {
                            dob = new Date(row.date_of_birth).toISOString().split('T')[0];
                        } catch (e) { dob = null; }
                    }

                    // Check if already exists by eri_applicant_id
                    const existing = await pool.query(
                        'SELECT id FROM applicants WHERE eri_applicant_id = $1',
                        [row.applicant_id_eri]
                    );

                    let applicantId;
                    if (existing.rows[0]) {
                        applicantId = existing.rows[0].id;
                    } else {
                        const inserted = await pool.query(
                            `INSERT INTO applicants (
                                eri_applicant_id, first_name, last_name, date_of_birth,
                                address1, address2, district_id, contact_number,
                                email, occupation, applicant_status, info_source,
                                applicant_comments, ownership_comments
                            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
                            RETURNING id`,
                            [
                                row.applicant_id_eri, firstName, lastName, dob,
                                address1, address2, districtId, contactNum,
                                email, occupation,
                                row.applicant_status || null,
                                row.info_source || null,
                                comments,
                                row.ownership_comments && row.ownership_comments !== 'NA' && row.ownership_comments !== 'MISSING'
                                    ? String(row.ownership_comments).trim() : null
                            ]
                        );
                        applicantId = inserted.rows[0].id;
                        results.applicants++;
                    }

                    applicantEriMap[row.applicant_id_eri] = applicantId;

                } catch (err) {
                    results.errors.push(`Applicant ${row.applicant_id_eri}: ${err.message}`);
                }
            }

            // ── APPLICATIONS ──
            const appSheet = workbook.Sheets['Applications'];
            if (appSheet) {
                const applications = XLSX.utils.sheet_to_json(appSheet);

                for (const row of applications) {
                    try {
                        const applicantId = applicantEriMap[row.applicant_id_eri];
                        if (!applicantId) continue;

                        const existing = await pool.query(
                            'SELECT id FROM applications WHERE eri_application_id = $1',
                            [row.application_id_eri]
                        );
                        if (existing.rows[0]) continue;

                        const rangeName = row.range ? String(row.range).toLowerCase().trim() : null;
                        const rangeId = rangeName
                            ? (rangeMap[rangeName] || rangeMap[rangeAliases[rangeName]] || null)
                            : null;

                        let appDate = null;
                        if (row.application_date && row.application_date !== 'MISSING') {
                            try { appDate = new Date(row.application_date).toISOString().split('T')[0]; }
                            catch (e) { appDate = null; }
                        }

                        await pool.query(
                            `INSERT INTO applications (
                                eri_application_id, applicant_id, range_id, info_source,
                                application_status, application_date, application_comments
                            ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                            [
                                row.application_id_eri, applicantId, rangeId,
                                row.info_source || null,
                                row.application_status && row.application_status !== 'MISSING' ? row.application_status : null,
                                appDate,
                                row.application_comments && row.application_comments !== 'NA' && row.application_comments !== 'MISSING'
                                    ? String(row.application_comments).trim() : null
                            ]
                        );
                        results.applications++;

                    } catch (err) {
                        results.errors.push(`Application ${row.application_id_eri}: ${err.message}`);
                    }
                }
            }

            // ── PERMITS ──
            const permitSheet = workbook.Sheets['Permits'];
            if (permitSheet) {
                const permits = XLSX.utils.sheet_to_json(permitSheet);

                for (const row of permits) {
                    try {
                        const applicantId = applicantEriMap[row.applicant_id_eri];
                        if (!applicantId) continue;

                        const rangeName = row.range ? String(row.range).toLowerCase().trim() : null;
                        const rangeId = rangeName
                            ? (rangeMap[rangeName] || rangeMap[rangeAliases[rangeName]] || null)
                            : null;

                        let issueDate = null;
                        if (row.issue_date && row.issue_date !== 'MISSING') {
                            try { issueDate = new Date(row.issue_date).toISOString().split('T')[0]; }
                            catch (e) { issueDate = null; }
                        }

                        const permitNum = row.permit_number !== null && row.permit_number !== undefined
                            ? String(row.permit_number).trim() : null;
                        const refNum = row.reference_number && row.reference_number !== 'MISSING'
                            ? String(row.reference_number).trim() : null;

                        await pool.query(
                            `INSERT INTO permits (
                                applicant_id, range_id, permit_number, reference_number,
                                issue_date, status, housing, picture_url,
                                permit_comments, info_source, number_of_pets
                            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
                            [
                                applicantId, rangeId, permitNum, refNum,
                                issueDate,
                                row.permit_status && row.permit_status !== 'MISSING' ? row.permit_status : 'Processing',
                                row.housing && row.housing !== 'MISSING' && row.housing !== 'NA' ? row.housing : null,
                                row.permit_picture && row.permit_picture !== 'MISSING' ? row.permit_picture : null,
                                row.permit_comments && row.permit_comments !== 'MISSING' && row.permit_comments !== 'NA'
                                    ? String(row.permit_comments).trim() : null,
                                row.info_source || null,
                                row.number_of_pets || 0
                            ]
                        );
                        results.permits++;

                    } catch (err) {
                        results.errors.push(`Permit ${row.permit_number}: ${err.message}`);
                    }
                }
            }

            // ── PARROTS ──
            const parrotSheet = workbook.Sheets['Parrots'];
            if (parrotSheet) {
                const parrots = XLSX.utils.sheet_to_json(parrotSheet);

                for (const row of parrots) {
                    try {
                        const applicantId = applicantEriMap[row.applicant_id_eri];
                        if (!applicantId) continue;

                        const existing = await pool.query(
                            'SELECT id FROM parrots WHERE eri_bird_id = $1',
                            [row.bird_id_eri]
                        );
                        if (existing.rows[0]) continue;

                        const rangeName = row.range ? String(row.range).toLowerCase().trim() : null;
                        const rangeId = rangeName
                            ? (rangeMap[rangeName] || rangeMap[rangeAliases[rangeName]] || null)
                            : null;

                        const speciesId = row.species_id || null;
                        const bandNum = row.band_number && row.band_number !== 'MISSING' && row.band_number !== 'NA'
                            ? String(row.band_number).trim() : null;
                        const petName = row.pet_name && row.pet_name !== 'MISSING' && row.pet_name !== 'NA'
                            ? String(row.pet_name).trim() : null;
                        const sex = row.sex && row.sex !== 'MISSING' ? String(row.sex).trim() : 'Unknown';
                        const methodObtained = row.obtain_by && row.obtain_by !== 'MISSING' && row.obtain_by !== 'NA'
                            ? String(row.obtain_by).trim() : null;
                        const stories = row.stories_about_parrot && row.stories_about_parrot !== 'NA' && row.stories_about_parrot !== 'MISSING'
                            ? String(row.stories_about_parrot).trim() : null;
                        const comments = row.bird_comments && row.bird_comments !== 'NA' && row.bird_comments !== 'MISSING'
                            ? String(row.bird_comments).trim() : null;
                        const healthComments = row.health_comments_by_applicant && row.health_comments_by_applicant !== 'NA' && row.health_comments_by_applicant !== 'MISSING'
                            ? String(row.health_comments_by_applicant).trim() : null;

                        await pool.query(
                            `INSERT INTO parrots (
                                eri_bird_id, applicant_id, species_id, range_id,
                                band_number, pet_name, sex, parrot_age_months,
                                method_obtained, period_of_ownership_months,
                                has_parrot, why_no_parrot, housing_details,
                                health_comments, stories, bird_comments,
                                info_source, parrot_status
                            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
                            [
                                row.bird_id_eri, applicantId, speciesId, rangeId,
                                bandNum, petName, sex,
                                row.parrot_age_months || null,
                                methodObtained,
                                row.period_of_ownership_months || null,
                                row.has_parrot && row.has_parrot !== 'MISSING' ? String(row.has_parrot) : 'Unknown',
                                row.why_no_parrot && row.why_no_parrot !== 'NA' && row.why_no_parrot !== 'MISSING'
                                    ? String(row.why_no_parrot) : null,
                                null,
                                healthComments,
                                stories,
                                comments,
                                row.info_source || null,
                                row.parrot_status || null
                            ]
                        );
                        results.parrots++;

                    } catch (err) {
                        results.errors.push(`Parrot ${row.bird_id_eri}: ${err.message}`);
                    }
                }
            }
        }

    } catch (err) {
        results.errors.push(`Fatal error: ${err.message}`);
    }

    res.render('import/index', { title: 'Import Data', results });
};

module.exports = { getImport, postImport, upload };