const permitModel = require('../models/permitModel');
const applicantModel = require('../models/applicantModel');
const rangeModel = require('../models/rangeModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const search = req.query.search || null;
        const permits = await permitModel.getAll(rangeId, search);
        res.render('permits/index', {
            title: 'Permits',
            permits,
            search: search || ''
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
        const [applicants, ranges] = await Promise.all([
            applicantModel.getAll(rangeId),
            rangeModel.getAll()
        ]);
        res.render('permits/create', {
            title: 'Add New Permit',
            applicants,
            ranges
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