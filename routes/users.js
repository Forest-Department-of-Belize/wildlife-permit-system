const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdminOrOIC, isAdmin } = require('../middleware/auth');
const c = require('../controllers/userController');

router.get('/profile', isLoggedIn, c.profile);
router.post('/profile', isLoggedIn, c.updateProfile);
router.get('/', isLoggedIn, isAdminOrOIC, c.index);
router.get('/create', isLoggedIn, isAdmin, c.create);
router.post('/', isLoggedIn, isAdmin, c.store);
router.get('/:uuid', isLoggedIn, isAdminOrOIC, c.view);
router.get('/:uuid/edit', isLoggedIn, isAdminOrOIC, c.edit);
router.post('/:uuid/resend-invite', isLoggedIn, isAdmin, c.resendInvite);
router.post('/:uuid/deactivate', isLoggedIn, isAdmin, c.deactivate);
router.post('/:uuid/reactivate', isLoggedIn, isAdmin, c.reactivate);
router.post('/:uuid', isLoggedIn, isAdminOrOIC, c.update);

module.exports = router;