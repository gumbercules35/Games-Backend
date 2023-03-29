const express = require("express");
const app = express();

const {
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
} = require(`${__dirname}/controllers/index.controller.js`);

app.use(express.json());

app.get("/api", getPaths);

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/users", getUsers);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/reviews/:review_id/comments", getCommentsByReview);
app.post("/api/reviews/:review_id/comments", postCommentToReview);

app.use("/*", invalidPathError);
app.use(psqlErrors);
app.use(customErrors);
app.use(uncaughtErrors);

module.exports = { app };
