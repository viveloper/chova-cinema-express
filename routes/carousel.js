const express = require('express');
const { getCarousel } = require('../controllers/carousel');

const router = express.Router();

router.route('/').get(getCarousel);

module.exports = router;
