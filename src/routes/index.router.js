const { categoryRouter } = require("./categories.router");
const { commentRouter } = require("./comments.router");
const { reviewRouter } = require("./reviews.router");
const { userRouter } = require("./users.router");

module.exports = { categoryRouter, reviewRouter, userRouter, commentRouter };
