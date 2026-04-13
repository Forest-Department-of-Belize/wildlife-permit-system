const speciesModel = require('../models/speciesModel');

const index = async (req, res) => {
    try {
        const species = await speciesModel.getAll();
        res.render('species/index', {
            title: 'Parrot Species',
            species
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const species = await speciesModel.findByUuid(req.params.uuid);
        if (!species) {
            req.session.error = 'Species not found';
            return res.redirect('/species');
        }
        res.render('species/view', {
            title: 'View Species',
            species
        });
    } catch (err) {
        console.error(err);
        res.redirect('/species');
    }
};

const create = (req, res) => {
    res.render('species/create', { title: 'Add New Species' });
};

const store = async (req, res) => {
    try {
        await speciesModel.create(req.body);
        req.session.success = 'Species added successfully';
        res.redirect('/species');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to add species';
        res.redirect('/species/create');
    }
};

const edit = async (req, res) => {
    try {
        const species = await speciesModel.findByUuid(req.params.uuid);
        if (!species) {
            req.session.error = 'Species not found';
            return res.redirect('/species');
        }
        res.render('species/edit', {
            title: 'Edit Species',
            species
        });
    } catch (err) {
        console.error(err);
        res.redirect('/species');
    }
};

const update = async (req, res) => {
    try {
        await speciesModel.update(req.params.uuid, req.body);
        req.session.success = 'Species updated successfully';
        res.redirect('/species');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update species';
        res.redirect(`/species/${req.params.uuid}/edit`);
    }
};

module.exports = { index, view, create, store, edit, update };