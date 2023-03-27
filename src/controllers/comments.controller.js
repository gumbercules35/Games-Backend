const {
  fetchCommentsByReview,
} = require(`${__dirname}/../models/fetchCommentsByReview.model.js`);

exports.getCommentsByReview = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByReview(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};
