const express = require('express');
const { getSpecials } = require('../controllers/specials');

const router = express.Router();

router.route('/').get(getSpecials);

module.exports = router;
