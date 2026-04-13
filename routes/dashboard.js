const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.get('/', isLoggedIn, dashboardController.index);

module.exports = router;