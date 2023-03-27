const express = require("express");
const app = express();

const {
  getCategories,
} = require(`${__dirname}/controllers/categories.controller.js`);
const {
  getReviewById,
} = require(`${__dirname}/controllers/reviews.controller.js`);
const {
  invalidPathError,
  psqlErrors,
  uncaughtErrors,
  customErrors,
} = require(`${__dirname}/controllers/errorHandling.controller.js`);

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.use("/*", invalidPathError);
app.use(psqlErrors);
app.use(customErrors);
app.use(uncaughtErrors);

module.exports = { app };
