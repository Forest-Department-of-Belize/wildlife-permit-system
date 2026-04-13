const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { hasPermission } = require('../middleware/permissions');
const c = require('../controllers/offenseController');

router.get('/', isLoggedIn, hasPermission('offenses-view'), c.index);
router.get('/create', isLoggedIn, hasPermission('offenses-add'), c.create);
router.post('/', isLoggedIn, hasPermission('offenses-add'), c.store);
router.get('/:uuid', isLoggedIn, hasPermission('offenses-view'), c.view);
router.get('/:uuid/edit', isLoggedIn, hasPermission('offenses-edit'), c.edit);
router.post('/:uuid', isLoggedIn, hasPermission('offenses-edit'), c.update);

module.exports = router;