const express = require('express');
const {
  getReview,
  addReview,
  deleteReview,
  editReview,
} = require('../controllers/review');
const { protect, optionalProtected } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(optionalProtected, getReview).post(protect, addReview);

router
  .route('/:reviewId')
  .delete(protect, deleteReview)
  .put(protect, editReview);

module.exports = router;
