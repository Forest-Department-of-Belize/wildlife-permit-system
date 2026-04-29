const applicantModel = require('../models/applicantModel');
const districtModel = require('../models/districtModel');
const rangeModel = require('../models/rangeModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const search = req.query.search || null;
        const applicants = await applicantModel.getAll(rangeId, search);
        res.render('applicants/index', {
            title: 'Applicants',
            applicants,
            search: search || ''
        });
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to load applicants';
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const applicant = await applicantModel.findByUuid(req.params.uuid);
        if (!applicant) {
            req.session.error = 'Applicant not found';
            return res.redirect('/applicants');
        }
        const [parrots, permits, applications, inspections, calls, offenses] = await Promise.all([
            applicantModel.getParrots(applicant.id),
            applicantModel.getPermits(applicant.id),
            applicantModel.getApplications(applicant.id),
            applicantModel.getInspections(applicant.id),
            applicantModel.getCalls(applicant.id),
            applicantModel.getOffenses(applicant.id)
        ]);
        res.render('applicants/view', {
            title: 'View Applicant',
            applicant,
            parrots,
            permits,
            applications,
            inspections,
            calls,
            offenses
        });
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to load applicant';
        res.redirect('/applicants');
    }
};

const create = async (req, res) => {
    try {
        const districts = await districtModel.getAll();
        res.render('applicants/create', {
            title: 'Add New Applicant',
            districts
        });
    } catch (err) {
        console.error(err);
        res.redirect('/applicants');
    }
};

const store = async (req, res) => {
    try {
        const applicant = await applicantModel.create(req.body);
        req.session.success = 'Applicant added successfully';
        res.redirect(`/applicants/${applicant.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to add applicant';
        res.redirect('/applicants/create');
    }
};

const edit = async (req, res) => {
    try {
        const applicant = await applicantModel.findByUuid(req.params.uuid);
        if (!applicant) {
            req.session.error = 'Applicant not found';
            return res.redirect('/applicants');
        }
        const districts = await districtModel.getAll();
        res.render('applicants/edit', {
            title: 'Edit Applicant',
            applicant,
            districts
        });
    } catch (err) {
        console.error(err);
        res.redirect('/applicants');
    }
};

const update = async (req, res) => {
    try {
        await applicantModel.update(req.params.uuid, req.body);
        req.session.success = 'Applicant updated successfully';
        res.redirect(`/applicants/${req.params.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update applicant';
        res.redirect(`/applicants/${req.params.uuid}/edit`);
    }
};

const search = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const applicants = await applicantModel.search(req.query.q, rangeId);
        res.json(applicants);
    } catch (err) {
        console.error(err);
        res.json([]);
    }
};

const destroy = async (req, res) => {
    try {
        await applicantModel.remove(req.params.uuid);
        req.session.success = 'Applicant deleted successfully';
        res.redirect('/applicants');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to delete applicant. Make sure all related records are removed first.';
        res.redirect(`/applicants/${req.params.uuid}`);
    }
};

module.exports = { index, view, create, store, edit, update, search, destroy };