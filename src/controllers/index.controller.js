const { getCategories, postCategory } = require("./categories.controller");
const {
  getCommentsByReview,
  postCommentToReview,
  deleteCommentById,
  patchCommentById,
} = require("./comments.controller");
const {
  invalidPathError,
  psqlErrors,
  customErrors,
  uncaughtErrors,
} = require("./errorHandling.controller");
const { getPaths } = require("./paths.controller");
const {
  getReviewById,
  getReviews,
  patchReviewVotes,
  postReview,
  deleteReviewById,
} = require("./reviews.controller");
const { getUsers, getUserByUsername } = require("./users.controller");

module.exports = {
  getUserByUsername,
  getCategories,
  getCommentsByReview,
  postCommentToReview,
  deleteCommentById,
  invalidPathError,
  psqlErrors,
  customErrors,
  uncaughtErrors,
  getPaths,
  getReviewById,
  getReviews,
  patchReviewVotes,
  getUsers,
  patchCommentById,
  postReview,
  postCategory,
  deleteReviewById,
};
