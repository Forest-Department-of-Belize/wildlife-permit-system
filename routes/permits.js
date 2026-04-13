const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { hasPermission } = require('../middleware/permissions');
const c = require('../controllers/permitController');

router.get('/', isLoggedIn, hasPermission('permits-view'), c.index);
router.get('/create', isLoggedIn, hasPermission('permits-add'), c.create);
router.post('/', isLoggedIn, hasPermission('permits-add'), c.store);
router.get('/:uuid', isLoggedIn, hasPermission('permits-view'), c.view);
router.get('/:uuid/edit', isLoggedIn, hasPermission('permits-edit'), c.edit);
router.post('/:uuid', isLoggedIn, hasPermission('permits-edit'), c.update);

module.exports = router;