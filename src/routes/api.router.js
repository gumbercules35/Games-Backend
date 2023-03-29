const {
  categoryRouter,
  reviewRouter,
  userRouter,
  commentRouter,
} = require(`${__dirname}/index.router.js`);

const { getPaths } = require(`${__dirname}/../controllers/index.controller`);

const apiRouter = require("express").Router();

apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentRouter);

apiRouter.get("/", getPaths);

module.exports = { apiRouter };
