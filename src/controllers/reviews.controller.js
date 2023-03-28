const {
  fetchReviewById,
} = require(`${__dirname}/../models/fetchReviewById.model.js`);
const {
  fetchReviews,
} = require(`${__dirname}/../models/fetchReviews.model.js`);
const {
  updateReviewVotes,
} = require(`${__dirname}/../models/updateReviewVotes.model.js`);

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

exports.getReviews = (req, res) => {
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
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
