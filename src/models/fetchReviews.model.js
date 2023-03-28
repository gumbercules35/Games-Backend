const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  const allowedSorts = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
  ];
  const allowedOrder = ["asc", "desc", "ASC", "DESC"];

  if (!allowedSorts.includes(sort_by) || !allowedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "400 Invalid Query" });
  }

  const queryParams = [];
  let queryStr = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id`;
  if (category) {
    queryParams.push(category);
    queryStr += ` WHERE category = $1`;
  }

  queryStr += ` GROUP BY reviews.review_id
      ORDER BY reviews.${sort_by} ${order}; `;
  return db.query(queryStr, queryParams).then(({ rows }) => rows);
};
