const knex = require("../db/connection");
const formatCriticData = require("../utils/mapCriticData");

const list = (isShowing) => isShowing === "true" ? listOnlyShowing() : listAll();

const listAll = () => knex("movies").select("*");

const listOnlyShowing = () => knex("movies as m")
  .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
  .select("m.movie_id", "m.title", "m.runtime_in_minutes", "rating", "description", "image_url")
  .groupBy("m.movie_id")
  .where({"mt.is_showing": true});

const read = (movieId) => knex("movies")
  .select("*")
  .where({ movie_id: movieId })
  .first();

const listTheatersByMovieId = (movieId) => knex("theaters as t")
  .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
  .where({ "mt.movie_id": movieId })
  .select("*");

const listReviewsByMovieId = (movieId) => knex("reviews as r")
  .join("critics as c", "r.critic_id", "c.critic_id")
  .where({ "r.movie_id": movieId })
  .select(
    "r.*",
    "c.critic_id as critic.critic_id",
    "c.preferred_name as critic.preferred_name",
    "c.surname as critic.surname",
    "c.organization_name as critic.organization_name"
  )
  .then(formatCriticData);

module.exports = {
  list,
  read,
  listTheatersByMovieId,
  listReviewsByMovieId,
};
