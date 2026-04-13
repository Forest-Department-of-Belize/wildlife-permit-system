const speciesModel = require('../models/speciesModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Make sure uploads/species folder exists
const uploadDir = 'public/images/species';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    }
});

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
        let imageUrl = req.body.image_url || null;
        if (req.file) {
            imageUrl = '/images/species/' + req.file.filename;
        }
        await speciesModel.create({
            common_name: req.body.common_name,
            scientific_name: req.body.scientific_name,
            image_url: imageUrl
        });
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
        let imageUrl = req.body.image_url || null;
        if (req.file) {
            imageUrl = '/images/species/' + req.file.filename;
        }
        await speciesModel.update(req.params.uuid, {
            common_name: req.body.common_name,
            scientific_name: req.body.scientific_name,
            image_url: imageUrl
        });
        req.session.success = 'Species updated successfully';
        res.redirect('/species');
    } catch (err) {
        console.error(err);
        req.session.error = 'Failed to update species';
        res.redirect(`/species/${req.params.uuid}/edit`);
    }
};

module.exports = { index, view, create, store, edit, update, upload };