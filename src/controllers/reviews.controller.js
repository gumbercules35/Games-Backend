const {
  fetchReviewById,
  fetchReviews,
  updateReviewVotes,
  checkRowExists,
  addReview,
} = require(`${__dirname}/../models/index.model.js`);

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
  const { category, sort_by, order, limit, p } = req.query;

  fetchReviews(category, sort_by, order, limit, p)
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

exports.postReview = (req, res, next) => {
  const { body } = req;
  const inputPromises = [];
  if (body.owner) {
    inputPromises.push(checkRowExists("users", "username", body.owner));
  }
  if (body.category)
    inputPromises.push(checkRowExists("categories", "slug", body.category));
  Promise.all(inputPromises)
    .then(() => {
      return addReview(body);
    })
    .then(({ review_id }) => {
      return fetchReviewById(review_id);
    })
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
