const Movie = require('../models/movieModel.js');

const ARTE_MOVIE_CODE_LIST = [
  16079, 16076, 15964, 16232, 16176, 15600, 16056, 16106, 12869, 16233, 16132,
  15558, 16097,
];
const OPERA_MOVIE_CODE_LIST = [12486];

// @desc    Get movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  const type = req.query.type;
  const playing = req.query.playing;
  const limit = isNaN(Number(req.query.limit))
    ? undefined
    : Number(req.query.limit);

  let findFilter = playing ? { MoviePlayYN: playing } : {};

  if (type === 'arte') {
    findFilter = {
      ...findFilter,
      $or: ARTE_MOVIE_CODE_LIST.map((movieCode) => ({
        RepresentationMovieCode: movieCode,
      })),
    };
  } else if (type === 'opera') {
    findFilter = {
      ...findFilter,
      $or: OPERA_MOVIE_CODE_LIST.map((movieCode) => ({
        RepresentationMovieCode: movieCode,
      })),
    };
  } else {
  }

  const movies = await Movie.find(findFilter)
    .select(
      'RepresentationMovieCode MovieNameKR PosterURL BookingRate ViewEvaluation DDay MoviePlayYN'
    )
    .sort({ ViewRate: -1 })
    .limit(limit)
    .exec();

  return res.status(200).json(
    movies.map((item) => ({
      movieCode: item.RepresentationMovieCode,
      movieName: item.MovieNameKR,
      posterUrl: item.PosterURL,
      bookingRate: item.BookingRate,
      viewEvaluation: item.ViewEvaluation,
      dday: Number(item.DDay),
      moviePlayYN: item.MoviePlayYN,
    }))
  );
};

// @desc    Get movie detail
// @route   GET /api/movies/:movieCode
// @access  Public
exports.getMovieDetail = async (req, res, next) => {
  const movieCode = req.params.movieCode;

  if (movieCode) {
    const movies = await Movie.find({
      RepresentationMovieCode: movieCode,
    }).exec();
    if (!movies.length) {
      return res.status(404).json({
        message: 'Not Found.',
      });
    }
    const movie = movies[0];
    return res.status(200).json({
      movieCode: movie.RepresentationMovieCode,
      movieName: movie.MovieNameKR,
      posterUrl: movie.PosterURL,
      viewEvaluation: movie.ViewEvaluation,
      bookingRate: movie.BookingRate,
      dday: Number(movie.DDay),
      moviePlayYN: movie.MoviePlayYN,
      viewGradeCode: movie.ViewGradeCode,
      cumulativeAudience: movie.KOFCustCnt,
      likeCount: movie.LikeCount,
      playTime: movie.PlayTime,
      genreName: movie.MovieGenreNameKR,
      genreName2: movie.MovieGenreNameKR2,
      makingNationName: movie.MakingNationNameKR,
      releaseDate: movie.ReleaseDate,
      synopsis: movie.SynopsisKR,
      manPrefer: Number(movie.ManPrefer),
      womanPrefer: Number(movie.WomanPrefer),
      agePrefer10: Number(movie.AgePrefer10),
      agePrefer20: Number(movie.AgePrefer20),
      agePrefer30: Number(movie.AgePrefer30),
      agePrefer40: Number(movie.AgePrefer40),
      casting: movie.Casting,
      trailer: movie.Trailer,
    });
  } else {
    res.status(400).json({
      message: 'required movieCode.',
    });
  }
};
