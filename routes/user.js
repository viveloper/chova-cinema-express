const express = require('express');
const { getUser } = require('../controllers/user');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getUser);

module.exports = router;
