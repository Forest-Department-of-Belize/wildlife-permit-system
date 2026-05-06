const callModel = require('../models/callModel');
const applicantModel = require('../models/applicantModel');
const userModel = require('../models/userModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const calls = await callModel.getAll(rangeId);
        res.render('calls/index', {
            title: 'Calls',
            calls
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const call = await callModel.findByUuid(req.params.uuid);
        if (!call) {
            req.session.error = 'Call record not found';
            return res.redirect('/calls');
        }
        res.render('calls/view', {
            title: 'View Call',
            call
        });
    } catch (err) {
        console.error(err);
        res.redirect('/calls');
    }
};

const create = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const { applicants } = await applicantModel.getAll(rangeId);

        let preselectedApplicant = null;
        let applicantUuid = null;

        if (req.query.applicant) {
            applicantUuid = req.query.applicant;
            preselectedApplicant = await applicantModel.findByUuid(applicantUuid);
        }

        res.render('calls/create', {
            title: 'Log New Call',
            applicants,
            preselectedApplicant,
            applicantUuid
        });
    } catch (err) {
        console.error(err);
        res.redirect('/calls');
    }
};

const store = async (req, res) => {
    try {
        if (!req.body.officer_id) {
            req.body.officer_id = req.session.user.id;
        }
        const call = await callModel.create(req.body);
        req.session.success = 'Call logged successfully';
        if (req.body.applicant_uuid) {
            return res.redirect(`/applicants/${req.body.applicant_uuid}`);
        }
        res.redirect(`/calls/${call.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to log call';
        res.redirect('/calls/create');
    }
};

const edit = async (req, res) => {
    try {
        const call = await callModel.findByUuid(req.params.uuid);
        if (!call) {
            req.session.error = 'Call record not found';
            return res.redirect('/calls');
        }
        res.render('calls/edit', {
            title: 'Edit Call',
            call
        });
    } catch (err) {
        console.error(err);
        res.redirect('/calls');
    }
};

const update = async (req, res) => {
    try {
        await callModel.update(req.params.uuid, req.body);
        req.session.success = 'Call updated successfully';
        res.redirect(`/calls/${req.params.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update call';
        res.redirect(`/calls/${req.params.uuid}/edit`);
    }
};

module.exports = { index, view, create, store, edit, update };