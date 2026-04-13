const rangeModel = require('../models/rangeModel');
const districtModel = require('../models/districtModel');

const index = async (req, res) => {
    try {
        const ranges = await rangeModel.getAll();
        res.render('ranges/index', {
            title: 'Forest Stations',
            ranges
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const range = await rangeModel.findByUuid(req.params.uuid);
        if (!range) {
            req.session.error = 'Station not found';
            return res.redirect('/ranges');
        }
        const stats = await rangeModel.getStats(range.id);
        res.render('ranges/view', {
            title: 'View Station',
            range,
            stats
        });
    } catch (err) {
        console.error(err);
        res.redirect('/ranges');
    }
};

const create = async (req, res) => {
    try {
        const districts = await districtModel.getAll();
        res.render('ranges/create', {
            title: 'Add New Station',
            districts
        });
    } catch (err) {
        console.error(err);
        res.redirect('/ranges');
    }
};

const store = async (req, res) => {
    try {
        await rangeModel.create(req.body);
        req.session.success = 'Station added successfully';
        res.redirect('/ranges');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to add station';
        res.redirect('/ranges/create');
    }
};

const edit = async (req, res) => {
    try {
        const range = await rangeModel.findByUuid(req.params.uuid);
        if (!range) {
            req.session.error = 'Station not found';
            return res.redirect('/ranges');
        }
        const districts = await districtModel.getAll();
        res.render('ranges/edit', {
            title: 'Edit Station',
            range,
            districts
        });
    } catch (err) {
        console.error(err);
        res.redirect('/ranges');
    }
};

const update = async (req, res) => {
    try {
        await rangeModel.update(req.params.uuid, req.body);
        req.session.success = 'Station updated successfully';
        res.redirect('/ranges');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update station';
        res.redirect(`/ranges/${req.params.uuid}/edit`);
    }
};

module.exports = { index, view, create, store, edit, update };