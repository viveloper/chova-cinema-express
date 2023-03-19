const Movie = require('../models/movieModel.js');

// @desc    Get movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  const type = req.query.type;
  const playing = req.query.playing;
  const limit = isNaN(Number(req.query.limit))
    ? undefined
    : Number(req.query.limit);

  if (type === 'arte') {
    const arteMovieCodeList = [
      16079, 16076, 15964, 16232, 16176, 15600, 16056, 16106, 12869, 16233,
      16132, 15558, 16097,
    ];
    const movies = await Movie.find({
      $or: arteMovieCodeList.map((movieCode) => ({
        RepresentationMovieCode: movieCode,
      })),
    })
      .select('-Review -Casting -Trailer')
      .sort({ ViewRate: -1 })
      .limit(limit)
      .exec();
    return res.status(200).json(movies);
  } else if (type === 'opera') {
    const movies = await Movie.find({
      $or: [
        {
          RepresentationMovieCode: 12486,
        },
      ],
    })
      .select('-Review -Casting -Trailer')
      .sort({ ViewRate: -1 })
      .limit(limit)
      .exec();
    return res.status(200).json(movies);
  } else {
    const movies = await Movie.find(
      playing ? { MoviePlayYN: playing } : undefined
    )
      .select('-Review -Casting -Trailer')
      .sort({ ViewRate: -1 })
      .limit(limit)
      .exec();
    return res.status(200).json(movies);
  }
};

// @desc    Get movie detail
// @route   GET /api/movies/:movieCode
// @access  Public
exports.getMovieDetail = async (req, res, next) => {
  const movieCode = req.params.movieCode;

  if (movieCode) {
    const movie = await Movie.find({ RepresentationMovieCode: movieCode })
      .select('-Review')
      .exec();
    return res.status(200).json(movie);
  } else {
    res.status(400).json({
      message: 'required movieCode.',
    });
  }
};
