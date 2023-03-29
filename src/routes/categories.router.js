const {
  getCategories,
} = require(`${__dirname}/../controllers/index.controller`);

const categoryRouter = require("express").Router();

categoryRouter.get("/", getCategories);

module.exports = { categoryRouter };
