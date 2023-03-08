const { query } = require('../api');

// @desc    Get movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  const type = req.query.type;
  const playing = req.query.playing;
  const limit = isNaN(Number(req.query.limit))
    ? undefined
    : Number(req.query.limit);

  let movies = [];
  if (type === 'general') {
    const data = await query({
      key: 'movies/general',
      url: '/data/home/movies.json',
    });
    movies = data.Movies.Items[0].Items;
  } else if (type === 'arte') {
    const data = await query({
      key: 'movies/arte',
      url: '/data/movies/arteMovieList.json',
    });
    movies = data.Movies.Items;
  } else if (type === 'opera') {
    const data = await query({
      key: 'movies/opera',
      url: '/data/movies/operaMovieList.json',
    });
    movies = data.Movies.Items;
  } else {
    const general = await query({
      key: 'movies/general',
      url: '/data/home/movies.json',
    });
    const arte = await query({
      key: 'movies/arte',
      url: '/data/movies/arteMovieList.json',
    });
    const opera = await query({
      key: 'movies/opera',
      url: '/data/movies/operaMovieList.json',
    });
    movies = [
      ...general.Movies.Items[0].Items,
      ...arte.Movies.Items,
      opera.Movies.Items,
    ];
  }

  movies = movies
    .filter((item) => item.RepresentationMovieCode !== 'AD')
    .filter((item) =>
      playing ? item.MoviePlayYN === playing.toUpperCase() : true
    );

  res.status(200).json(movies.slice(0, limit ?? movies.length));
};

// @desc    Get movie detail
// @route   GET /api/movies/:movieCode
// @access  Public
exports.getMovieDetail = async (req, res, next) => {
  const movieCode = req.params.movieCode;

  if (movieCode) {
    const data = await query({
      key: `movieDetail/${movieCode}`,
      url: `/data/movieDetail/${movieCode}.json`,
    });

    res.status(200).json({
      movieDetail: data.Movie,
      casting: data.Casting.Items,
      trailer: data.Trailer.Items,
    });
  } else {
    res.status(400).json({
      message: 'required movieCode.',
    });
  }
};
