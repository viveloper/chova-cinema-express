const express = require('express');
const { signin, login, logout } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/signin').post(signin);
router.route('/login').post(login);
router.route('/logout').get(protect, logout);

module.exports = router;
