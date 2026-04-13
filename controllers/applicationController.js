const applicationModel = require('../models/applicationModel');
const applicantModel = require('../models/applicantModel');
const rangeModel = require('../models/rangeModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const applications = await applicationModel.getAll(rangeId);
        res.render('applications/index', {
            title: 'Applications',
            applications
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const application = await applicationModel.findByUuid(req.params.uuid);
        if (!application) {
            req.session.error = 'Application not found';
            return res.redirect('/applications');
        }
        res.render('applications/view', {
            title: 'View Application',
            application
        });
    } catch (err) {
        console.error(err);
        res.redirect('/applications');
    }
};

const create = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const [applicants, ranges] = await Promise.all([
            applicantModel.getAll(rangeId),
            rangeModel.getAll()
        ]);
        res.render('applications/create', {
            title: 'New Application',
            applicants,
            ranges
        });
    } catch (err) {
        console.error(err);
        res.redirect('/applications');
    }
};

const store = async (req, res) => {
    try {
        if (!req.body.range_id && req.session.user.range_id) {
            req.body.range_id = req.session.user.range_id;
        }
        const application = await applicationModel.create(req.body);
        req.session.success = 'Application added successfully';
        res.redirect(`/applications/${application.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to add application';
        res.redirect('/applications/create');
    }
};

const edit = async (req, res) => {
    try {
        const application = await applicationModel.findByUuid(req.params.uuid);
        if (!application) {
            req.session.error = 'Application not found';
            return res.redirect('/applications');
        }
        const ranges = await rangeModel.getAll();
        res.render('applications/edit', {
            title: 'Edit Application',
            application,
            ranges
        });
    } catch (err) {
        console.error(err);
        res.redirect('/applications');
    }
};

const update = async (req, res) => {
    try {
        await applicationModel.update(req.params.uuid, req.body);
        req.session.success = 'Application updated successfully';
        res.redirect(`/applications/${req.params.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update application';
        res.redirect(`/applications/${req.params.uuid}/edit`);
    }
};

module.exports = { index, view, create, store, edit, update };