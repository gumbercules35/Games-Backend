const { addCommentOnReview } = require("./addCommentOnReview.model");
const { checkRowExists } = require("./checkRowExists.model");
const { fetchCategories } = require("./fetchCategories.model");
const { fetchCommentsByReview } = require("./fetchCommentsByReview.model");
const { fetchPaths } = require("./fetchPaths.model");
const { fetchReviewById } = require("./fetchReviewById.model");
const { fetchReviews } = require("./fetchReviews.model");
const { fetchUserByUsername } = require("./fetchUserByUsername.model");
const { fetchUsers } = require("./fetchUsers.model");
const { removeCommentById } = require("./removeCommentById.model");
const { updateReviewVotes } = require("./updateReviewVotes.model");
const { updateCommentById } = require("./updateCommentById.model");

module.exports = {
  addCommentOnReview,
  checkRowExists,
  fetchCategories,
  fetchCommentsByReview,
  fetchPaths,
  fetchReviewById,
  fetchReviews,
  fetchUsers,
  removeCommentById,
  updateReviewVotes,
  fetchUserByUsername,
  updateCommentById,
};
