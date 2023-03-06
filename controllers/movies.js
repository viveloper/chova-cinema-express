const immer = require('immer');
const { query } = require('../api');
const { getS3FullPath } = require('../utils');

// @desc    Get movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  let result = [];

  if (req.query.type === 'current') {
    const movies = await query({
      key: 'movies/current',
      url: '/data/home/movies.json',
    });
    result = movies.Movies.Items[0].Items.filter(
      (item) => item.MoviePlayYN === 'Y'
    );
  } else if (req.query.type === 'pre') {
    const movies = await query({
      key: 'movies/pre',
      url: '/data/home/movies.json',
    });
    result = movies.Movies.Items[0].Items.filter(
      (item) => item.MoviePlayYN === 'N'
    );
  } else if (req.query.type === 'arte') {
    const movies = await query({
      key: 'movies/arte',
      url: '/data/movies/arteMovieList.json',
    });
    result = movies.Movies.Items;
  } else if (req.query.type === 'opera') {
    const movies = await query({
      key: 'movies/opera',
      url: '/data/movies/operaMovieList.json',
    });
    result = movies.Movies.Items;
  } else {
    const movies = await query({
      key: 'movies',
      url: '/data/home/movies.json',
    });
    result = movies.Movies.Items[0].Items;
  }

  res.status(200).json(
    result.map((movie) => ({
      ...movie,
      PosterURL: getS3FullPath(movie.PosterURL),
    }))
  );
};

// @desc    Get movie detail
// @route   GET /api/movies/:movieCode
// @access  Public
exports.getMovieDetail = async (req, res, next) => {
  const movieCode = req.params.movieCode;

  const movieDetail = await query({
    key: `movieDetail/${movieCode}`,
    url: `/data/movieDetail/${movieCode}.json`,
  });

  const newMovieDetail = immer.produce(movieDetail, (draft) => {
    draft.Casting.Items.forEach((item) => {
      item.StaffImage = getS3FullPath(item.StaffImage);
    });
    draft.Movie.PosterURL = getS3FullPath(draft.Movie.PosterURL);
    draft.Trailer.Items.forEach((item) => {
      item.ImageURL = getS3FullPath(item.ImageURL);
      item.MediaURL = getS3FullPath(item.MediaURL);
    });
  });

  res.status(200).json(newMovieDetail);
};
