const { query } = require('../api');

// @desc    Get special cinemas info
// @route   GET /api/specials
// @access  Public
exports.getSpecials = async (req, res, next) => {
  const specials = await query({
    key: 'specials',
    url: `/data/home/cinemaData.json`,
  });

  res.status(200).json(specials);
};
