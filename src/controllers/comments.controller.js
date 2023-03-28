const {
  fetchCommentsByReview,
} = require(`${__dirname}/../models/fetchCommentsByReview.model.js`);
const {
  checkRowExists,
} = require(`${__dirname}/../models/checkRowExists.model.js`);
const {
  addCommentOnReview,
} = require(`${__dirname}/../models/addCommentOnReview.model.js`);

exports.getCommentsByReview = (req, res, next) => {
  const { review_id } = req.params;
  // checkRowExists("reviews", "review_id", review_id);
  fetchCommentsByReview(review_id)
    .then((comments) => {
      if (comments.length === 0) {
        return checkRowExists("reviews", "review_id", review_id);
      } else res.status(200).send({ comments });
    })
    .then((comments) => {
      res.status(200).send({ comments: [] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentToReview = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  checkRowExists("reviews", "review_id", review_id)
    .then(() => {
      return addCommentOnReview(review_id, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};
