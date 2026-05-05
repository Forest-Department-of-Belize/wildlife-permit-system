const applicantModel = require('../models/applicantModel');
const districtModel = require('../models/districtModel');
const rangeModel = require('../models/rangeModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const search = req.query.search || null;
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const offset = (page - 1) * limit;
        const sort = req.query.sort || 'last_name';
        const dir = req.query.dir || 'asc';

        const { applicants, total } = await applicantModel.getAll(rangeId, search, limit, offset, sort, dir);
        const totalPages = Math.ceil(total / limit);

        res.render('applicants/index', {
            title: 'Applicants',
            applicants,
            search: search || '',
            page,
            totalPages,
            total,
            sort,
            dir
        });
    } catch (err) {
        console.error(err);
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
        const ranges = await rangeModel.getAll();
        res.render('applicants/create', {
            title: 'Add New Applicant',
            districts,
            ranges
        });
    } catch (err) {
        console.error(err);
        res.redirect('/applicants');
    }
};

const store = async (req, res) => {
    try {
        const errors = [];
        if (!req.body.first_name || req.body.first_name.trim() === '') {
            errors.push('First name is required');
        }
        if (!req.body.last_name || req.body.last_name.trim() === '') {
            errors.push('Last name is required');
        }
        if (req.body.email && req.body.email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                errors.push('Please enter a valid email address');
            }
        }
        if (req.body.contact_number && req.body.contact_number.trim() !== '') {
            const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
            if (!phoneRegex.test(req.body.contact_number)) {
                errors.push('Please enter a valid phone number');
            }
        }
        if (errors.length > 0) {
            req.session.error = errors.join(', ');
            return res.redirect('/applicants/create');
        }

        // Auto assign ranger's station
        if (!req.body.range_id && req.session.user.range_id) {
            req.body.range_id = req.session.user.range_id;
        }

        const applicant = await applicantModel.create(req.body);
        req.session.success = 'Applicant added successfully';
        res.redirect(`/applicants/${applicant.uuid}`);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            req.session.error = 'An applicant with that ID number already exists';
        } else {
            req.session.error = 'Failed to add applicant. Please try again.';
        }
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
        if (err.code === '23503') {
            req.session.error = 'Cannot delete this applicant because they have related records. Delete their parrots, permits, inspections and calls first.';
        } else {
            req.session.error = 'Failed to delete applicant. Please try again.';
        }
        res.redirect(`/applicants/${req.params.uuid}`);
    }
};

const updateNotes = async (req, res) => {
    try {
        await applicantModel.updateNotes(req.params.uuid, req.body.applicant_notes || '');
        req.session.success = 'Notes saved successfully';
        res.redirect(`/applicants/${req.params.uuid}#notes`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to save notes';
        res.redirect(`/applicants/${req.params.uuid}#notes`);
    }
};

module.exports = { index, view, create, store, edit, update, updateNotes, search, destroy };