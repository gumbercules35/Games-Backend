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

const { apiRouter } = require(`${__dirname}/routes/api.router.js`);

app.use(express.json());
app.use("/api", apiRouter);

app.use("/*", invalidPathError);
app.use(psqlErrors);
app.use(customErrors);
app.use(uncaughtErrors);

module.exports = { app };
