const offenseModel = require('../models/offenseModel');
const applicantModel = require('../models/applicantModel');
const userModel = require('../models/userModel');
const rangeModel = require('../models/rangeModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const offenses = await offenseModel.getAll(rangeId);
        res.render('offenses/index', {
            title: 'Compound Offenses',
            offenses
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const offense = await offenseModel.findByUuid(req.params.uuid);
        if (!offense) {
            req.session.error = 'Offense record not found';
            return res.redirect('/offenses');
        }
        res.render('offenses/view', {
            title: 'View Offense',
            offense
        });
    } catch (err) {
        console.error(err);
        res.redirect('/offenses');
    }
};

const create = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const [{applicants}, officers, ranges] = await Promise.all([
            applicantModel.getAll(rangeId),
            userModel.getAll(rangeId),
            rangeModel.getAll()
        ]);
        res.render('offenses/create', {
            title: 'Add New Offense',
            applicants,
            officers,
            ranges
        });
    } catch (err) {
        console.error(err);
        res.redirect('/offenses');
    }
};

const store = async (req, res) => {
    try {
        if (!req.body.range_id && req.session.user.range_id) {
            req.body.range_id = req.session.user.range_id;
        }
        if (!req.body.officer_id) {
            req.body.officer_id = req.session.user.id;
        }
        const offense = await offenseModel.create(req.body);
        req.session.success = 'Offense recorded successfully';
        res.redirect(`/offenses/${offense.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to record offense';
        res.redirect('/offenses/create');
    }
};

const edit = async (req, res) => {
    try {
        const offense = await offenseModel.findByUuid(req.params.uuid);
        if (!offense) {
            req.session.error = 'Offense not found';
            return res.redirect('/offenses');
        }
        const rangeId = getRangeFilter(req);
        const [officers, ranges] = await Promise.all([
            userModel.getAll(rangeId),
            rangeModel.getAll()
        ]);
        res.render('offenses/edit', {
            title: 'Edit Offense',
            offense,
            officers,
            ranges
        });
    } catch (err) {
        console.error(err);
        res.redirect('/offenses');
    }
};

const update = async (req, res) => {
    try {
        await offenseModel.update(req.params.uuid, req.body);
        req.session.success = 'Offense updated successfully';
        res.redirect(`/offenses/${req.params.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update offense';
        res.redirect(`/offenses/${req.params.uuid}/edit`);
    }
};

module.exports = { index, view, create, store, edit, update };