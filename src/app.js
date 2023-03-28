const express = require("express");
const app = express();

const {
  getCategories,
} = require(`${__dirname}/controllers/categories.controller.js`);
const {
  getReviewById,
  getReviews,
  patchReviewVotes,
} = require(`${__dirname}/controllers/reviews.controller.js`);
const {
  getCommentsByReview,
  postCommentToReview,
} = require(`${__dirname}/controllers/comments.controller.js`);
const {
  invalidPathError,
  psqlErrors,
  uncaughtErrors,
  customErrors,
} = require(`${__dirname}/controllers/errorHandling.controller.js`);

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewVotes);

app.get("/api/reviews/:review_id/comments", getCommentsByReview);
app.post("/api/reviews/:review_id/comments", postCommentToReview);

app.use("/*", invalidPathError);
app.use(psqlErrors);
app.use(customErrors);
app.use(uncaughtErrors);

module.exports = { app };
