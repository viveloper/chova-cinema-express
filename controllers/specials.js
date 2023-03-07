const { query } = require('../api');

// @desc    Get special cinemas info
// @route   GET /api/specials
// @access  Public
exports.getSpecials = async (req, res, next) => {
  const data = await query({
    key: 'specials',
    url: `/data/home/cinemaData.json`,
  });

  res.status(200).json(data.Items);
};
