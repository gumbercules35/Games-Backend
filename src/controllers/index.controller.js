const { getCategories } = require("./categories.controller");
const {
  getCommentsByReview,
  postCommentToReview,
  deleteCommentById,
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
} = require("./reviews.controller");
const { getUsers } = require("./users.controller");

module.exports = {
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
};