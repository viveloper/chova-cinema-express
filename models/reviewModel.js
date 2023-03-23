const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  ReviewID: {
    type: 'Number',
    required: true,
    unique: true,
  },
  MemberNo: {
    type: 'Number',
  },
  MemberID: {
    type: 'String',
  },
  MemberName: {
    type: 'String',
  },
  ReviewText: {
    type: 'String',
  },
  MoviePlayYN: {
    type: 'String',
  },
  Evaluation: {
    type: 'Number',
  },
  RecommandCount: {
    type: 'Number',
  },
  MovieViewYN: {
    type: 'String',
  },
  RepresentationMovieCode: {
    type: 'String',
  },
  MemberRecommandYN: {
    type: 'String',
  },
  RegistDate: {
    type: 'String',
  },
  ProfilePhoto: {
    type: 'String',
  },
  MemberNickName: {
    type: 'String',
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
