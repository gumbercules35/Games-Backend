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
      return rows;
    });
};
