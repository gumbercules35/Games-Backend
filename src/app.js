const express = require("express");
const app = express();

const {
  getCategories,
} = require(`${__dirname}/controllers/categories.controller.js`);
const {
  invalidPathError,
} = require(`${__dirname}/controllers/errorHandling.controller.js`);

app.use(express.json());

app.route("/api/categories").get(getCategories);

app.use("/*", invalidPathError);

module.exports = { app };
