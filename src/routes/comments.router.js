const commentRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentById,
} = require(`${__dirname}/../controllers/index.controller`);

commentRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = { commentRouter };
