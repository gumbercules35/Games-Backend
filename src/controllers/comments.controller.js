const {
  fetchCommentsByReview,
} = require(`${__dirname}/../models/fetchCommentsByReview.model.js`);
const {
  checkRowExists,
} = require(`${__dirname}/../models/checkRowExists.model.js`);
const {
  addCommentOnReview,
} = require(`${__dirname}/../models/addCommentOnReview.model.js`);
const {
  removeCommentById,
} = require(`${__dirname}/../models/removeCommentById.model.js`);

exports.getCommentsByReview = (req, res, next) => {
  const { review_id } = req.params;
  // checkRowExists("reviews", "review_id", review_id);
  fetchCommentsByReview(review_id)
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
