const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { hasPermission } = require('../middleware/permissions');
const c = require('../controllers/applicantController');

router.get('/', isLoggedIn, hasPermission('applicants-view'), c.index);
router.get('/search', isLoggedIn, hasPermission('applicants-view'), c.search);
router.get('/create', isLoggedIn, hasPermission('applicants-add'), c.create);
router.post('/', isLoggedIn, hasPermission('applicants-add'), c.store);
router.get('/:uuid', isLoggedIn, hasPermission('applicants-view'), c.view);
router.get('/:uuid/edit', isLoggedIn, hasPermission('applicants-edit'), c.edit);
router.post('/:uuid', isLoggedIn, hasPermission('applicants-edit'), c.update);

module.exports = router;