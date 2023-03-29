const { getPaths } = require(`${__dirname}/../controllers/paths.controller`);

const apiRouter = require("express").Router();

apiRouter.get("/", getPaths);

module.exports = { apiRouter };
