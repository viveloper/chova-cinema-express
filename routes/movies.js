const express = require('express');
const { getMovies, getMovieDetail } = require('../controllers/movies');

const router = express.Router();

router.route('/').get(getMovies);
router.route('/:movieCode').get(getMovieDetail);

module.exports = router;
