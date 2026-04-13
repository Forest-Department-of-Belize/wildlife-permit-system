const permitModel = require('../models/permitModel');
const applicantModel = require('../models/applicantModel');
const rangeModel = require('../models/rangeModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const permits = await permitModel.getAll(rangeId);
        res.render('permits/index', {
            title: 'Permits',
            permits
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
        if (!req.body.range_id && req.session.user.range_id) {
            req.body.range_id = req.session.user.range_id;
        }
        const permit = await permitModel.create(req.body);
        req.session.success = 'Permit added successfully';
        res.redirect(`/permits/${permit.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to add permit';
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