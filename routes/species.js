const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { hasPermission } = require('../middleware/permissions');
const c = require('../controllers/speciesController');

router.get('/', isLoggedIn, hasPermission('species-view'), c.index);
router.get('/create', isLoggedIn, hasPermission('species-add'), c.create);
router.post('/', isLoggedIn, hasPermission('species-add'), c.upload.single('image_file'), c.store);
router.get('/:uuid', isLoggedIn, hasPermission('species-view'), c.view);
router.get('/:uuid/edit', isLoggedIn, hasPermission('species-edit'), c.edit);
router.post('/:uuid', isLoggedIn, hasPermission('species-edit'), c.upload.single('image_file'), c.update);

module.exports = router;