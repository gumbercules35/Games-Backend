const db = require(`${__dirname}/../../db/connection.js`);

exports.addCommentOnReview = (reviewId, postBody) => {
  const { username, body } = postBody;
  return db
    .query(
      `INSERT INTO comments
    (review_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
      [reviewId, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
