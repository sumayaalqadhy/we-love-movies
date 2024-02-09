const knex = require("../db/connection");
const formatCriticData = require("../utils/mapCriticData");

const update = (newReview) => knex("reviews")
  .where({ review_id: newReview.review_id })
  .update(newReview, ["*"])
  .then(data => data[0]); 

const read = (reviewId) => knex("reviews")
  .select("*")
  .where({ review_id: reviewId })
  .first(); 

const getCriticById = (criticId) => knex("critics")
  .select("*")
  .where({ critic_id: criticId })
  .first(); 

const destroy = (reviewId) => knex("reviews")
  .where({ review_id: reviewId })
  .del(); 

module.exports = {
  update,
  read,
  getCriticById,
  destroy,
};
