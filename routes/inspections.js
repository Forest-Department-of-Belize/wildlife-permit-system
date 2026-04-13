const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { hasPermission } = require('../middleware/permissions');
const c = require('../controllers/inspectionController');

router.get('/', isLoggedIn, hasPermission('inspections-view'), c.index);
router.get('/create', isLoggedIn, hasPermission('inspections-add'), c.create);
router.post('/', isLoggedIn, hasPermission('inspections-add'), c.store);
router.get('/:uuid', isLoggedIn, hasPermission('inspections-view'), c.view);
router.get('/:uuid/edit', isLoggedIn, hasPermission('inspections-edit'), c.edit);
router.post('/:uuid', isLoggedIn, hasPermission('inspections-edit'), c.update);

module.exports = router;