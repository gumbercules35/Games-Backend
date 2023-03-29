const userRouter = require("express").Router();
const { getUsers } = require(`${__dirname}/../controllers/index.controller`);

userRouter.get("/", getUsers);

module.exports = { userRouter };
