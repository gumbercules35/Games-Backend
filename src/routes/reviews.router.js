const {
  getReviewById,
  getReviews,
  patchReviewVotes,
  getCommentsByReview,
  postCommentToReview,
} = require(`${__dirname}/../controllers/index.controller`);

const reviewRouter = require("express").Router();

reviewRouter.get("/", getReviews);

reviewRouter.route("/:review_id").get(getReviewById).patch(patchReviewVotes);

reviewRouter
  .route("/:review_id/comments")
  .get(getCommentsByReview)
  .post(postCommentToReview);

module.exports = { reviewRouter };
