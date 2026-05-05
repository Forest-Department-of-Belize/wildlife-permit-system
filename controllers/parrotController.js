const parrotModel = require('../models/parrotModel');
const applicantModel = require('../models/applicantModel');
const speciesModel = require('../models/speciesModel');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const search = req.query.search || null;
        const parrots = await parrotModel.getAll(rangeId, search);
        res.render('parrots/index', {
            title: 'Parrots',
            parrots,
            search: search || ''
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

const view = async (req, res) => {
    try {
        const parrot = await parrotModel.findByUuid(req.params.uuid);
        if (!parrot) {
            req.session.error = 'Parrot not found';
            return res.redirect('/parrots');
        }
        res.render('parrots/view', {
            title: 'View Parrot',
            parrot
        });
    } catch (err) {
        console.error(err);
        res.redirect('/parrots');
    }
};

const create = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const [{applicants}, species] = await Promise.all([
            applicantModel.getAll(rangeId),
            speciesModel.getAll()
        ]);
        res.render('parrots/create', {
            title: 'Add New Parrot',
            applicants,
            species
        });
    } catch (err) {
        console.error(err);
        res.redirect('/parrots');
    }
};

const store = async (req, res) => {
    try {
        if (!req.body.range_id && req.session.user.range_id) {
            req.body.range_id = req.session.user.range_id;
        }
        const parrot = await parrotModel.create(req.body);
        req.session.success = 'Parrot added successfully';
        res.redirect(`/parrots/${parrot.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to add parrot';
        res.redirect('/parrots/create');
    }
};

const edit = async (req, res) => {
    try {
        const parrot = await parrotModel.findByUuid(req.params.uuid);
        if (!parrot) {
            req.session.error = 'Parrot not found';
            return res.redirect('/parrots');
        }
        const species = await speciesModel.getAll();
        res.render('parrots/edit', {
            title: 'Edit Parrot',
            parrot,
            species
        });
    } catch (err) {
        console.error(err);
        res.redirect('/parrots');
    }
};

const update = async (req, res) => {
    try {
        await parrotModel.update(req.params.uuid, req.body);
        req.session.success = 'Parrot updated successfully';
        res.redirect(`/parrots/${req.params.uuid}`);
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update parrot';
        res.redirect(`/parrots/${req.params.uuid}/edit`);
    }
};

const destroy = async (req, res) => {
    try {
        await parrotModel.remove(req.params.uuid);
        req.session.success = 'Parrot deleted successfully';
        res.redirect('/parrots');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to delete parrot';
        res.redirect('/parrots');
    }
};

module.exports = { index, view, create, store, edit, update, destroy };