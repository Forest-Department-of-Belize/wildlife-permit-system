const districtModel = require('../models/districtModel');

const index = async (req, res) => {
    try {
        const districts = await districtModel.getAll();
        res.render('districts/index', {
            title: 'Districts',
            districts
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const create = (req, res) => {
    res.render('districts/create', { title: 'Add New District' });
};

const store = async (req, res) => {
    try {
        await districtModel.create(req.body);
        req.session.success = 'District added successfully';
        res.redirect('/districts');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to add district';
        res.redirect('/districts/create');
    }
};

const edit = async (req, res) => {
    try {
        const district = await districtModel.findByUuid(req.params.uuid);
        if (!district) {
            req.session.error = 'District not found';
            return res.redirect('/districts');
        }
        res.render('districts/edit', {
            title: 'Edit District',
            district
        });
    } catch (err) {
        console.error(err);
        res.redirect('/districts');
    }
};

const update = async (req, res) => {
    try {
        await districtModel.update(req.params.uuid, req.body);
        req.session.success = 'District updated successfully';
        res.redirect('/districts');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update district';
        res.redirect(`/districts/${req.params.uuid}/edit`);
    }
};

module.exports = { index, create, store, edit, update };