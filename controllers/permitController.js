const permitModel = require('../models/permitModel');
const applicantModel = require('../models/applicantModel');
const rangeModel = require('../models/rangeModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const search = req.query.search || null;
        const status = req.query.status || null;
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const offset = (page - 1) * limit;
        const sort = req.query.sort || 'created_at';
        const dir = req.query.dir || 'desc';

        const { permits, total } = await permitModel.getAll(rangeId, search, limit, offset, sort, dir, status);
        const totalPages = Math.ceil(total / limit);

        res.render('permits/index', {
            title: 'Permits',
            permits,
            search: search || '',
            page,
            totalPages,
            total,
            sort,
            dir,
            status
        });
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to load permits';
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const permit = await permitModel.findByUuid(req.params.uuid);
        if (!permit) {
            req.session.error = 'Permit not found';
            return res.redirect('/permits');
        }
        res.render('permits/view', {
            title: 'View Permit',
            permit
        });
    } catch (err) {
        console.error(err);
        res.redirect('/permits');
    }
};

const create = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const [{ applicants }, ranges] = await Promise.all([
            applicantModel.getAll(rangeId),
            rangeModel.getAll()
        ]);

        let preselectedApplicant = null;
        let applicantUuid = null;

        if (req.query.applicant) {
            applicantUuid = req.query.applicant;
            preselectedApplicant = await applicantModel.findByUuid(applicantUuid);
        }

        res.render('permits/create', {
            title: 'Add New Permit',
            applicants,
            ranges,
            preselectedApplicant,
            applicantUuid
        });
    } catch (err) {
        console.error(err);
        res.redirect('/permits');
    }
};

const store = async (req, res) => {
    try {
        const errors = [];
        if (!req.body.applicant_id) {
            errors.push('Please select an applicant');
        }
        if (!req.body.permit_number || req.body.permit_number.trim() === '') {
            errors.push('Permit number is required');
        }
        if (!req.body.range_id && !req.session.user.range_id) {
            errors.push('Please select a forest station');
        }
        if (errors.length > 0) {
            req.session.error = errors.join(', ');
            return res.redirect('/permits/create');
        }
        if (!req.body.range_id && req.session.user.range_id) {
            req.body.range_id = req.session.user.range_id;
        }
        const permit = await permitModel.create(req.body);
        req.session.success = 'Permit added successfully';
        if (req.body.applicant_uuid) {
            return res.redirect(`/applicants/${req.body.applicant_uuid}`);
        }
        res.redirect(`/permits/${permit.uuid}`);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            req.session.error = 'A permit with that number already exists';
        } else {
            req.session.error = 'Failed to add permit. Please try again.';
        }
        res.redirect('/permits/create');
    }
};

const edit = async (req, res) => {
    try {
        const permit = await permitModel.findByUuid(req.params.uuid);
        if (!permit) {
            req.session.error = 'Permit not found';
            return res.redirect('/permits');
        }
        const ranges = await rangeModel.getAll();
        res.render('permits/edit', {
            title: 'Edit Permit',
            permit,
            ranges
        });
    } catch (err) {
        console.error(err);
        res.redirect('/permits');
    }
};

const update = async (req, res) => {
    try {
        await permitModel.update(req.params.uuid, req.body);
        req.session.success = 'Permit updated successfully';
        res.redirect(`/permits/${req.params.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update permit';
        res.redirect(`/permits/${req.params.uuid}/edit`);
    }
};

module.exports = { index, view, create, store, edit, update };