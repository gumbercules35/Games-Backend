const {
  fetchReviewById,
} = require(`${__dirname}/../models/fetchReviewById.model.js`);
const {
  fetchReviews,
} = require(`${__dirname}/../models/fetchReviews.model.js`);
const {
  updateReviewVotes,
} = require(`${__dirname}/../models/updateReviewVotes.model.js`);
const {
  checkRowExists,
} = require(`${__dirname}/../models/checkRowExists.model.js`);

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;

  fetchReviews(category, sort_by, order)
    .then((reviews) => {
      if (reviews.length === 0 && category) {
        return checkRowExists("categories", "slug", category);
      } else res.status(200).send({ reviews });
    })
    .then(() => {
      res.status(200).send({ reviews: [] });
    })
    .catch((err) => next(err));
};

exports.patchReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;

  updateReviewVotes(review_id, body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
