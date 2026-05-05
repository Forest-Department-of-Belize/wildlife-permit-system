const inspectionModel = require('../models/inspectionModel');
const applicantModel = require('../models/applicantModel');
const userModel = require('../models/userModel');
const parrotModel = require('../models/parrotModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const search = req.query.search || null;
        const view = req.query.view || 'list';
        const inspections = await inspectionModel.getAll(rangeId, search);

        // Calendar data
        const today = new Date();
        const calYear  = parseInt(req.query.year)  || today.getFullYear();
        const calMonth = parseInt(req.query.month) || (today.getMonth() + 1);

        const monthNames = ['January','February','March','April','May','June',
                            'July','August','September','October','November','December'];
        const monthName = monthNames[calMonth - 1];
        const firstDay  = new Date(calYear, calMonth - 1, 1).getDay();
        const daysInMonth = new Date(calYear, calMonth, 0).getDate();

        const prevMonth = calMonth === 1  ? 12 : calMonth - 1;
        const prevYear  = calMonth === 1  ? calYear - 1 : calYear;
        const nextMonth = calMonth === 12 ? 1  : calMonth + 1;
        const nextYear  = calMonth === 12 ? calYear + 1 : calYear;

        const STATUS_COLORS = {
            scheduled:  '#FFC107',
            approved:   '#2E7D32',
            confiscate: '#C62828',
            completed:  '#1565C0'
        };

        const calEvents = {};
        inspections.forEach(i => {
            if (!i.inspection_date) return;
            const d = new Date(i.inspection_date);
            const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
            if (!calEvents[key]) calEvents[key] = [];
            calEvents[key].push({
                uuid: i.uuid,
                applicant: (i.applicant_name || '').split(' ').pop(),
                status: i.inspection_status,
                color: STATUS_COLORS[i.inspection_status] || '#607D8B'
            });
        });

        res.render('inspections/index', {
            title: 'Inspections',
            inspections,
            search: search || '',
            view,
            calYear,
            calMonth,
            monthName,
            firstDay,
            daysInMonth,
            prevMonth, prevYear,
            nextMonth, nextYear,
            calEvents,
            todayDay:   today.getDate(),
            todayMonth: today.getMonth() + 1,
            todayYear:  today.getFullYear()
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
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
        const { applicants } = await applicantModel.getAll(rangeId);

        let preselectedApplicant = null;
        let applicantUuid = null;

        if (req.query.applicant) {
            applicantUuid = req.query.applicant;
            preselectedApplicant = await applicantModel.findByUuid(applicantUuid);
        }

        res.render('inspections/create', {
            title: 'Schedule Inspection',
            applicants,
            preselectedApplicant,
            applicantUuid
        });
    } catch (err) {
        console.error(err);
        res.redirect('/inspections');
    }
};

const store = async (req, res) => {
    try {
        const errors = [];
        if (!req.body.applicant_id) {
            errors.push('Please select an applicant');
        }
        if (!req.body.inspector_name || req.body.inspector_name.trim() === '') {
            errors.push('Inspector name is required');
        }
        if (!req.body.inspection_date) {
            errors.push('Inspection date is required');
        }
        if (errors.length > 0) {
            req.session.error = errors.join(', ');
            return res.redirect('/inspections/create');
        }
        if (!req.body.range_id && req.session.user.range_id) {
            req.body.range_id = req.session.user.range_id;
        }
        const inspection = await inspectionModel.create(req.body);
        req.session.success = 'Inspection scheduled successfully';
        if (req.body.applicant_uuid) {
            return res.redirect(`/applicants/${req.body.applicant_uuid}`);
        }
        res.redirect(`/inspections/${inspection.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to schedule inspection. Please try again.';
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
        const parrots = await applicantModel.getParrots(inspection.applicant_id);
        res.render('inspections/edit', {
            title: 'Edit Inspection',
            inspection,
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