const Carousel = require('../models/carouselModel.js');

// @desc    Get carousel items
// @route   GET /api/carousel
// @access  Public
exports.getCarousel = async (req, res, next) => {
  const use = req.query.use;

  const data = await Carousel.find(use ? { use } : undefined).exec();
  return res.status(200).json(data);
};
