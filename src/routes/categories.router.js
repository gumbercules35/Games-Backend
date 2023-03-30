const {
  getCategories,
  postCategory,
} = require(`${__dirname}/../controllers/index.controller`);

const categoryRouter = require("express").Router();

categoryRouter.route("/").get(getCategories).post(postCategory);

module.exports = { categoryRouter };
