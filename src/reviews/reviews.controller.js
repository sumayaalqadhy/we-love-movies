const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const checkReviewExist = async (req, res, next) => {
  const reviewId = Number(req.params.reviewId); 
  const foundReview = await reviewsService.read(reviewId);

  if (foundReview) {
    res.locals.review = foundReview;
    next();
  } else {
    next({
      status: 404,
      message: `Review cannot be found for id: ${reviewId}`,
    });
  }
};

const destroy = async (req, res, next) => {
  await reviewsService.destroy(Number(req.params.reviewId));
  res.sendStatus(204);
};

const update = async (req, res, next) => {
  const originalReview = res.locals.review;
  const reviewUpdates = req.body.data;

  const revisedReview = {
    ...originalReview,
    ...reviewUpdates,
  };

  await reviewsService.update(revisedReview);
  const updatedReviewDetails = await reviewsService.read(revisedReview.review_id);
  updatedReviewDetails.critic = await reviewsService.getCriticById(revisedReview.critic_id);

  res.json({ data: updatedReviewDetails });
};

module.exports = {
  update: [asyncErrorBoundary(checkReviewExist), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(checkReviewExist), asyncErrorBoundary(destroy)],
};
