const inspectionModel = require('../models/inspectionModel');
const applicantModel = require('../models/applicantModel');
const userModel = require('../models/userModel');
const parrotModel = require('../models/parrotModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const search = req.query.search || null;
        const inspections = await inspectionModel.getAll(rangeId, search);
        res.render('inspections/index', {
            title: 'Inspections',
            inspections,
            search: search || ''
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};
};

const view = async (req, res) => {
    try {
        const inspection = await inspectionModel.findByUuid(req.params.uuid);
        if (!inspection) {
            req.session.error = 'Inspection not found';
            return res.redirect('/inspections');
        }
        const parrots = await applicantModel.getParrots(inspection.applicant_id);
        res.render('inspections/view', {
            title: 'View Inspection',
            inspection,
            parrots
        });
    } catch (err) {
        console.error(err);
        res.redirect('/inspections');
    }
};

const create = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const [applicants, inspectors] = await Promise.all([
            applicantModel.getAll(rangeId),
            userModel.getAll(rangeId)
        ]);
        res.render('inspections/create', {
            title: 'Schedule Inspection',
            applicants,
            inspectors
        });
    } catch (err) {
        console.error(err);
        res.redirect('/inspections');
    }
};

const store = async (req, res) => {
    try {
        if (!req.body.range_id && req.session.user.range_id) {
            req.body.range_id = req.session.user.range_id;
        }
        const inspection = await inspectionModel.create(req.body);
        req.session.success = 'Inspection scheduled successfully';
        res.redirect(`/inspections/${inspection.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to schedule inspection';
        res.redirect('/inspections/create');
    }
};

const edit = async (req, res) => {
    try {
        const inspection = await inspectionModel.findByUuid(req.params.uuid);
        if (!inspection) {
            req.session.error = 'Inspection not found';
            return res.redirect('/inspections');
        }
        const rangeId = getRangeFilter(req);
        const [inspectors, parrots] = await Promise.all([
            userModel.getAll(rangeId),
            applicantModel.getParrots(inspection.applicant_id)
        ]);
        res.render('inspections/edit', {
            title: 'Edit Inspection',
            inspection,
            inspectors,
            parrots
        });
    } catch (err) {
        console.error(err);
        res.redirect('/inspections');
    }
};

const update = async (req, res) => {
    try {
        const inspection = await inspectionModel.findByUuid(req.params.uuid);
        await inspectionModel.update(req.params.uuid, req.body);
        if (req.body.inspection_status === 'confiscate') {
            const parrotIds = req.body.parrots_to_confiscate
                ? [].concat(req.body.parrots_to_confiscate).map(Number)
                : [];
            await inspectionModel.confiscateParrots(inspection.id, parrotIds);
        }
        req.session.success = 'Inspection updated successfully';
        res.redirect(`/inspections/${req.params.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update inspection';
        res.redirect(`/inspections/${req.params.uuid}/edit`);
    }
};

module.exports = { index, view, create, store, edit, update };