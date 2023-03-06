const express = require('express');
const {
  getTicketingData,
  getPlaySequence,
  getSeats,
  getUserTicketingList,
  addUserTicketing,
  deleteUserTicketing,
} = require('../controllers/ticketing');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getTicketingData);
router.route('/playSequence').get(getPlaySequence);
router.route('/seats').get(getSeats);
router
  .route('/userTicketing')
  .get(protect, getUserTicketingList)
  .post(protect, addUserTicketing);
router
  .route('/userTicketing/:ticketingId')
  .delete(protect, deleteUserTicketing);

module.exports = router;
