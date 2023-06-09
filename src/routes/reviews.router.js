const {
  getReviewById,
  getReviews,
  patchReviewVotes,
  getCommentsByReview,
  postCommentToReview,
  postReview,
  deleteReviewById,
} = require(`${__dirname}/../controllers/index.controller`);

const reviewRouter = require("express").Router();

reviewRouter.route("/").get(getReviews).post(postReview);

reviewRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotes)
  .delete(deleteReviewById);

reviewRouter
  .route("/:review_id/comments")
  .get(getCommentsByReview)
  .post(postCommentToReview);

module.exports = { reviewRouter };
