const db = require(`${__dirname}/../../db/connection.js`);

exports.updateCommentById = (comment_id, body) => {
  const { inc_votes } = body;
  return db
    .query(
      `UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return rows[0];
    });
};
