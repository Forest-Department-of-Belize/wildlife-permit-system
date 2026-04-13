const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const c = require('../controllers/rangeController');

router.get('/', isLoggedIn, isAdmin, c.index);
router.get('/create', isLoggedIn, isAdmin, c.create);
router.post('/', isLoggedIn, isAdmin, c.store);
router.get('/:uuid', isLoggedIn, isAdmin, c.view);
router.get('/:uuid/edit', isLoggedIn, isAdmin, c.edit);
router.post('/:uuid', isLoggedIn, isAdmin, c.update);

module.exports = router;