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

        res.render('offenses/create', {
            title: 'Add New Offense',
            applicants,
            ranges,
            preselectedApplicant,
            applicantUuid
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
        if (req.body.applicant_uuid) {
            return res.redirect(`/applicants/${req.body.applicant_uuid}`);
        }
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
        const ranges = await rangeModel.getAll();
        res.render('offenses/edit', {
            title: 'Edit Offense',
            offense,
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