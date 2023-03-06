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

  res.status(200).json(
    data.map((item) => ({
      ...item,
      img: getS3FullPath(item.img),
      video: getS3FullPath(item.video),
    }))
  );
};
