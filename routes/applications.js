const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { hasPermission } = require('../middleware/permissions');
const c = require('../controllers/applicationController');

router.get('/', isLoggedIn, hasPermission('applications-view'), c.index);
router.get('/create', isLoggedIn, hasPermission('applications-add'), c.create);
router.post('/', isLoggedIn, hasPermission('applications-add'), c.store);
router.get('/:uuid', isLoggedIn, hasPermission('applications-view'), c.view);
router.get('/:uuid/edit', isLoggedIn, hasPermission('applications-edit'), c.edit);
router.post('/:uuid', isLoggedIn, hasPermission('applications-edit'), c.update);

module.exports = router;