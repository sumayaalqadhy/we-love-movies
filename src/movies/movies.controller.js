const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function verifyMovieAvailability(req, res, next) {
  const { movieId } = req.params; // Destructuring for cleaner code.
  const movie = await moviesService.read(movieId);

  if (movie) {
    res.locals.movie = movie;
    next();
  } else {
    next({ status: 404, message: `No movie found with ID: ${movieId}.` });
  }
}

const list = async (req, res, next) => {
  const data = await moviesService.list(req.query.is_showing);
  res.json({ data });
};

const read = async (req, res, next) => {
  res.json({ data: res.locals.movie });
};

const readTheatersByMovieId = async (req, res, next) => {
  const data = await moviesService.listTheatersByMovieId(+req.params.movieId); // Unary plus for coercion to Number.
  res.json({ data });
};

const readReviewsByMovieId = async (req, res, next) => {
  const data = await moviesService.listReviewsByMovieId(+req.params.movieId); // Unary plus for coercion to Number.
  res.json({ data });
};

module.exports = {
  list: asyncErrorBoundary(list),
  read: [verifyMovieAvailability, read],
  readTheatersByMovieId: [verifyMovieAvailability, asyncErrorBoundary(readTheatersByMovieId)],
  readReviewsByMovieId: [verifyMovieAvailability, asyncErrorBoundary(readReviewsByMovieId)],
};

