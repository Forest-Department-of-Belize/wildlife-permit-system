const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { hasPermission } = require('../middleware/permissions');
const c = require('../controllers/callController');

router.get('/', isLoggedIn, hasPermission('calls-view'), c.index);
router.get('/create', isLoggedIn, hasPermission('calls-add'), c.create);
router.post('/', isLoggedIn, hasPermission('calls-add'), c.store);
router.get('/:uuid', isLoggedIn, hasPermission('calls-view'), c.view);
router.get('/:uuid/edit', isLoggedIn, hasPermission('calls-edit'), c.edit);
router.post('/:uuid', isLoggedIn, hasPermission('calls-edit'), c.update);

module.exports = router;