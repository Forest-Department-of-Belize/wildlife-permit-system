const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const importController = require('../controllers/importController');

router.get('/', isLoggedIn, isAdmin, importController.getImport);
router.post('/', isLoggedIn, isAdmin, importController.upload.single('file'), importController.postImport);

module.exports = router;