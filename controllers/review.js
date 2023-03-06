const { getRandomInt } = require('../utils');
const { query } = require('../api');

// @desc    Get review
// @route   GET /api/review
// @access  Public
exports.getReview = async (req, res, next) => {
  const movieCode = req.query.movieCode;
  const page = req.query.page ? req.query.page : 1;
  const count = req.query.count ? req.query.count : 10;
  const sortType = req.query.sortType ? req.query.sortType : 'recent';

  const review = await query({
    key: `review/${movieCode}`,
    url: `/data/movieDetail/${movieCode}-review.json`,
  });

  const sortedReview = {
    ...review,
    TotalReviewItems: {
      ...review.TotalReviewItems,
      Items:
        sortType === 'recent'
          ? review.TotalReviewItems.Items
          : review.TotalReviewItems.Items.sort(
              (a, b) => b.RecommandCount - a.RecommandCount
            ),
    },
  };

  const loginUser = req.user;
  if (loginUser) {
    const userReview = sortedReview.TotalReviewItems.Items.find(
      (item) => item.MemberID === loginUser.id
    );
    if (userReview) {
      const idx = sortedReview.TotalReviewItems.Items.indexOf(userReview);
      sortedReview.TotalReviewItems.Items.splice(idx, 1);
      sortedReview.TotalReviewItems.Items.unshift(userReview);
    }
  }

  const begin = count * (page - 1);
  const end =
    count * page < sortedReview.TotalReviewItems.Items.length
      ? count * page
      : sortedReview.TotalReviewItems.Items.length;
  const pagedReview = {
    ...sortedReview,
    TotalReviewItems: {
      ...sortedReview.TotalReviewItems,
      Items: sortedReview.TotalReviewItems.Items.slice(begin, end),
      ItemCount: end - begin,
    },
  };

  res.status(200).json(pagedReview);
};

// @desc    Post review
// @route   GET /api/review
// @access  Private
exports.addReview = async (req, res, next) => {
  const { movieCode, reviewText, evaluation } = req.body;
  const loginUser = req.user;

  const reviewData = await query({
    key: `review/${movieCode}`,
    url: `/data/movieDetail/${movieCode}-review.json`,
  });

  const userReview = reviewData.TotalReviewItems.Items.find(
    (item) => item.MemberID === loginUser.id
  );
  if (userReview) {
    return res.status(409).json({
      success: false,
      message: '실관람평이 존재합니다. 확인해주세요.',
    });
  }

  const reviewId = getRandomInt(10000000, 1000000000);

  const newReview = {
    ReviewID: reviewId,
    MemberNo: parseInt(loginUser.id),
    MemberID: loginUser.id,
    MemberName: loginUser.name,
    ReviewText: reviewText,
    MoviePlayYN: '',
    Evaluation: evaluation,
    RecommandCount: 0,
    MovieViewYN: '',
    RepresentationMovieCode: movieCode,
    MemberRecommandYN: '',
    RegistDate: new Date().toISOString().slice(0, 10).split('-').join('.'),
    ProfilePhoto: '',
    MemberNickName: '',
  };

  reviewData.TotalReviewItems.Items.unshift(newReview);
  const reviewCount = reviewData.TotalReviewItems.Items.length;
  reviewData.TotalReviewItems.ItemCount = reviewCount;
  reviewData.ReviewCounts.RealReviewCount = reviewCount;
  reviewData.ReviewCounts.TotalReviewCount = reviewCount;
  reviewData.ReviewCounts.MarkAvg = Math.floor(
    reviewData.TotalReviewItems.Items.reduce(
      (acc, review) => acc + review.Evaluation,
      0
    ) / reviewCount
  );

  const usersData = await query({
    key: 'users',
    url: '/data/users/users.json',
  });

  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  targetUser.reviewList.push(reviewId);

  res.status(200).json({ success: true, review: newReview });
};

// @desc    Delete review
// @route   DELETE /api/review
// @access  Private
exports.deleteReview = async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);
  const { movieCode } = req.body;
  const loginUser = req.user;

  const reviewData = await query({
    key: `review/${movieCode}`,
    url: `/data/movieDetail/${movieCode}-review.json`,
  });

  const targetReview = reviewData.TotalReviewItems.Items.find(
    (item) => item.ReviewID === reviewId
  );
  if (targetReview.MemberID !== loginUser.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized user',
    });
  }

  const idx = reviewData.TotalReviewItems.Items.indexOf(targetReview);
  reviewData.TotalReviewItems.Items.splice(idx, 1);
  const reviewCount = reviewData.TotalReviewItems.Items.length;
  reviewData.TotalReviewItems.ItemCount = reviewCount;
  reviewData.ReviewCounts.RealReviewCount = reviewCount;
  reviewData.ReviewCounts.TotalReviewCount = reviewCount;
  reviewData.ReviewCounts.MarkAvg = Math.floor(
    reviewData.TotalReviewItems.Items.reduce(
      (acc, review) => acc + review.Evaluation,
      0
    ) / reviewCount
  );

  const usersData = await query({
    key: 'users',
    url: '/data/users/users.json',
  });

  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  targetUser.reviewList = targetUser.reviewList.filter(
    (item) => item !== reviewId
  );

  res.status(200).json({ success: true, review: targetReview });
};

// @desc    Edit review
// @route   PUT /api/review
// @access  Private
exports.editReview = async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);
  const { movieCode, reviewText, evaluation, recommend } = req.body;

  const reviewData = await query({
    key: `review/${movieCode}`,
    url: `/data/movieDetail/${movieCode}-review.json`,
  });

  const targetReview = reviewData.TotalReviewItems.Items.find(
    (item) => item.ReviewID === reviewId
  );

  targetReview.ReviewText = reviewText ? reviewText : targetReview.ReviewText;
  targetReview.Evaluation = evaluation ? evaluation : targetReview.Evaluation;
  if (recommend) {
    const loginUser = req.user;

    const usersData = await query({
      key: 'users',
      url: '/data/users/users.json',
    });
    const targetUser = usersData.users.find(
      (user) => user.email === loginUser.email
    );

    const isLiked = targetUser.reviewLikeList.includes(reviewId);

    targetReview.RecommandCount = isLiked
      ? targetReview.RecommandCount - 1
      : targetReview.RecommandCount + 1;

    if (isLiked) {
      targetUser.reviewLikeList = targetUser.reviewLikeList.filter(
        (item) => item !== reviewId
      );
    } else {
      targetUser.reviewLikeList.push(reviewId);
    }
  }

  reviewData.ReviewCounts.MarkAvg = Math.floor(
    reviewData.TotalReviewItems.Items.reduce(
      (acc, review) => acc + review.Evaluation,
      0
    ) / reviewData.TotalReviewItems.Items.length
  );

  res.status(200).json({ success: true, review: targetReview });
};

// @desc    Recommend review
// @route   PUT /api/review
// @access  Private
