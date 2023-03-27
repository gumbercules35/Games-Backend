const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT * 
  FROM reviews 
  WHERE review_id = $1`,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Review Not Found" });
      } else return rows;
    });
};
