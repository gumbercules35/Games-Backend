const db = require(`${__dirname}/../../db/connection.js`);

exports.updateReviewVotes = (review_id, patchObj) => {
  const { inc_votes } = patchObj;

  return db
    .query(
      `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
  `,
      [inc_votes, review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      } else return rows[0];
    });
};
