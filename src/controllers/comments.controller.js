const {
  fetchCommentsByReview,
  checkRowExists,
  addCommentOnReview,
  removeCommentById,
  updateCommentById,
} = require(`${__dirname}/../models/index.model.js`);

exports.getCommentsByReview = (req, res, next) => {
  const { review_id } = req.params;
  const { limit, p } = req.query;
  // checkRowExists("reviews", "review_id", review_id);
  fetchCommentsByReview(review_id, limit, p)
    .then((comments) => {
      if (comments.length === 0) {
        return checkRowExists("reviews", "review_id", review_id);
      } else res.status(200).send({ comments });
    })
    .then(() => {
      res.status(200).send({ comments: [] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentToReview = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;

  const checkInputPromises = [
    checkRowExists("reviews", "review_id", review_id),
  ];
  if (body.username) {
    checkInputPromises.push(checkRowExists("users", "username", body.username));
  }

  Promise.all(checkInputPromises)
    .then(() => {
      return addCommentOnReview(review_id, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { body } = req;

  updateCommentById(comment_id, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => next(err));
};
