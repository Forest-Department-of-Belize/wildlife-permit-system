const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { hasPermission } = require('../middleware/permissions');
const c = require('../controllers/parrotController');

router.get('/', isLoggedIn, hasPermission('parrots-view'), c.index);
router.get('/create', isLoggedIn, hasPermission('parrots-add'), c.create);
router.post('/', isLoggedIn, hasPermission('parrots-add'), c.store);
router.get('/:uuid', isLoggedIn, hasPermission('parrots-view'), c.view);
router.get('/:uuid/edit', isLoggedIn, hasPermission('parrots-edit'), c.edit);
router.post('/:uuid', isLoggedIn, hasPermission('parrots-edit'), c.update);
router.post('/:uuid/delete', isLoggedIn, hasPermission('parrots-delete'), c.destroy);

module.exports = router;