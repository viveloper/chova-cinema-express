const User = require('../models/userModel.js');

// @desc    Get user data
// @route   GET /api/user
// @access  Private
exports.getUser = async (req, res, next) => {
  const userId = req.user.id;

  const users = await User.find({ id: userId }).exec();

  const { id, name, email, reviewList, reviewLikeList, ticketingList } =
    users[0];

  res.status(200).json({
    id,
    name,
    email,
    reviewList,
    reviewLikeList,
    ticketingList,
  });
};
