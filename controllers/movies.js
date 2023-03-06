const immer = require('immer');
const { query } = require('../api');
const { getS3FullPath } = require('../utils');

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

  // if (type === 'arte') {
  //   const data = await query({
  //     key: 'movies/arte',
  //     url: '/data/movies/arteMovieList.json',
  //   });
  //   movies = data.Movies.Items;
  // } else if (type === 'opera') {
  //   const data = await query({
  //     key: 'movies/opera',
  //     url: '/data/movies/operaMovieList.json',
  //   });
  //   movies = data.Movies.Items;
  // } else {
  //   const data = await query({
  //     key: 'movies/general',
  //     url: '/data/home/movies.json',
  //   });
  //   movies = data.Movies.Items[0].Items;
  // }

  // movies = movies
  //   .filter((item) => item.RepresentationMovieCode !== 'AD')
  //   .filter((item) =>
  //     playing ? item.MoviePlayYN === playing.toUpperCase() : true
  //   );

  res.status(200).json(movies.slice(0, limit ?? movies.length));
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
