const db = require(`${__dirname}/../../db/connection.js`);

exports.removeReviewById = (review_id) => {
  return db
    .query(
      `
  DELETE FROM reviews
  WHERE review_id = $1
  RETURNING *;`,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
    });
};
