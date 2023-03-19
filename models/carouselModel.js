const mongoose = require('mongoose');

const carouselSchema = mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  use: {
    type: String,
    required: true,
  },
});

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel;
