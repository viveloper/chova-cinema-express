const { query } = require('../api');
const { getS3FullPath } = require('../utils');

// @desc    Get carousel items
// @route   GET /api/carousel
// @access  Public
exports.getCarousel = async (req, res, next) => {
  const data = await query({
    key: 'carousel',
    url: `/data/home/carouseItems.json`,
  });

  switch (req.query.use) {
    case 'home':
      res.status(200).json(data.filter((item) => item.use === 'home'));
      break;
    case 'movie':
      res.status(200).json(data.filter((item) => item.use === 'movie'));
      break;
    default:
      res.status(200).json(data);
      break;
  }
};
