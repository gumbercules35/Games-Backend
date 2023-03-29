const userRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
} = require(`${__dirname}/../controllers/index.controller`);

userRouter.route("/").get(getUsers);

userRouter.route("/:username").get(getUserByUsername);

module.exports = { userRouter };
