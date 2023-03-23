const { getRandomInt } = require('../utils');
const { query } = require('../api');
const Review = require('../models/reviewModel.js');
const User = require('../models/userModel.js');

// @desc    Get review
// @route   GET /api/review
// @access  Public
exports.getReview = async (req, res, next) => {
  const movieCode = req.query.movieCode;
  const page = req.query.page
    ? !isNaN(Number(req.query.page))
      ? Number(req.query.page)
      : 1
    : 1;
  const count = req.query.count
    ? !isNaN(Number(req.query.count))
      ? Number(req.query.count)
      : 10
    : 10;
  const sortType = req.query.sortType ? req.query.sortType : 'recent';

  if (!movieCode) {
    return res.status(400).json({
      message: 'Missing required parameter: movieCode',
    });
  }

  const reviews = await Review.find({ RepresentationMovieCode: movieCode })
    .select(
      'ReviewID MemberID MemberName ReviewText Evaluation RecommandCount RepresentationMovieCode RegistDate MemberNickName'
    )
    .sort(sortType === 'like' ? { RecommandCount: -1 } : { ReviewID: -1 })
    .skip((page - 1) * count)
    .limit(count)
    .exec();

  const aggregatedReviews = await Review.aggregate()
    .match({ RepresentationMovieCode: movieCode })
    .group({
      _id: '$RepresentationMovieCode',
      scoreAvg: { $avg: '$Evaluation' },
      totalCount: { $sum: 1 },
    })
    .exec();

  const loginUser = req.user;
  if (loginUser) {
    const userReview = reviews.find(
      (review) => review.MemberID === loginUser.id
    );
    if (userReview) {
      const idx = reviews.indexOf(userReview);
      reviews.splice(idx, 1);
      reviews.unshift(userReview);
    }
  }

  res.status(200).json({
    page,
    reviews,
    pageCount: reviews.length,
    totalCount:
      aggregatedReviews.length === 0 ? 0 : aggregatedReviews[0].totalCount,
    scoreAvg:
      aggregatedReviews.length === 0
        ? 0
        : Number(aggregatedReviews[0].scoreAvg.toFixed(1)),
  });
};

// @desc    Post review
// @route   POST /api/review
// @access  Private
exports.addReview = async (req, res, next) => {
  const { movieCode, text, score } = req.body;
  const loginUser = req.user;

  const reviewExists = await Review.findOne({
    RepresentationMovieCode: movieCode,
    MemberID: loginUser.id,
  });

  if (reviewExists) {
    return res.status(409).json({
      message: '실관람평이 존재합니다. 확인해주세요.',
    });
  }

  const aggregatedReviews = await Review.aggregate()
    .group({
      _id: null,
      maxReviewId: { $max: '$ReviewID' },
    })
    .exec();

  const maxReviewId = aggregatedReviews[0].maxReviewId;
  const newReivewId = maxReviewId + 1;

  const createdReview = await Review.create({
    ReviewID: newReivewId,
    MemberNo: parseInt(loginUser.id),
    MemberID: loginUser.id,
    MemberName: loginUser.name,
    ReviewText: text,
    MoviePlayYN: '',
    Evaluation: score,
    RecommandCount: 0,
    MovieViewYN: '',
    RepresentationMovieCode: movieCode,
    MemberRecommandYN: '',
    RegistDate: new Date().toISOString().slice(0, 10).split('-').join('.'),
    ProfilePhoto: '',
    MemberNickName: '',
  });

  const targetUser = await User.findOne({ id: loginUser.id });
  targetUser.reviewList = [...targetUser.reviewList, createdReview.ReviewID];
  await targetUser.save();

  res.status(201).json(createdReview);
};

// @desc    Delete review
// @route   DELETE /api/review/:reviewId
// @access  Private
exports.deleteReview = async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);
  const loginUser = req.user;

  const targetReview = await Review.findOneAndDelete({ ReviewID: reviewId });
  if (!targetReview) {
    return res.status(404).json({
      message: 'Not Found.',
    });
  }

  if (targetReview.MemberID !== loginUser.id) {
    return res.status(401).json({
      message: 'Not authorized user',
    });
  }

  const targetUser = await User.findOne({ id: loginUser.id });
  targetUser.reviewList = targetUser.reviewList.filter(
    (review) => review !== targetReview.ReviewID
  );
  await targetUser.save();

  return res.status(200).json(targetReview);
};

// @desc    Edit review
// @route   PUT /api/review
// @access  Private
exports.editReview = async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);
  const { text, score, toggleLike } = req.body;
  const loginUser = req.user;

  const targetReview = await Review.findOne({ ReviewID: reviewId });

  if (targetReview.MemberID !== loginUser.id) {
    return res.status(401).json({
      message: 'Not authorized user',
    });
  }

  targetReview.ReviewText = text ? text : targetReview.ReviewText;
  targetReview.Evaluation = score ? score : targetReview.Evaluation;

  if (toggleLike) {
    const targetUser = await User.findOne({ id: loginUser.id });
    const isLiked = targetUser.reviewLikeList.includes(reviewId);

    targetReview.RecommandCount = isLiked
      ? targetReview.RecommandCount - 1
      : targetReview.RecommandCount + 1;

    if (isLiked) {
      targetUser.reviewLikeList = targetUser.reviewLikeList.filter(
        (item) => item !== reviewId
      );
    } else {
      targetUser.reviewLikeList = [...targetUser.reviewLikeList, reviewId];
    }
    await targetUser.save();
  }
  await targetReview.save();

  res.status(200).json({ success: true, review: targetReview });
};
