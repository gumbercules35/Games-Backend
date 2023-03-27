const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchCommentsByReview = (review_id) => {
  return db
    .query(
      `SELECT *
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC;`,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 No Comments Found" });
      } else {
        return rows;
      }
    });
};
