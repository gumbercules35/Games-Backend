const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchCommentsByReview = (review_id, limit = 10, p = 0) => {
  const parsedLimit = parseInt(limit);
  const parsedP = parseInt(p);

  if (isNaN(parsedLimit) || isNaN(parsedP)) {
    return Promise.reject({ status: 400, msg: "400 Invalid Query" });
  }
  let queryStr = `SELECT *
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC
      LIMIT ${parsedLimit}`;

  const offset = parsedP - 1;

  if (offset > 0) {
    queryStr += ` OFFSET ${offset * parsedLimit}`;
  } else {
    queryStr += `;`;
  }

  return db.query(queryStr, [review_id]).then(({ rows }) => {
    return rows;
  });
};
