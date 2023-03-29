const commentRouter = require("express").Router();
const {
  deleteCommentById,
} = require(`${__dirname}/../controllers/index.controller`);

commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = { commentRouter };
