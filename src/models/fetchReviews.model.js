const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchReviews = (
  category,
  sort_by = "created_at",
  order = "DESC",
  limit = 10,
  p = 0
) => {
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
    "comment_count",
  ];
  const allowedOrder = ["asc", "desc", "ASC", "DESC"];

  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(p);

  if (
    !allowedSorts.includes(sort_by) ||
    !allowedOrder.includes(order) ||
    isNaN(parsedLimit) ||
    isNaN(parsedPage)
  ) {
    return Promise.reject({ status: 400, msg: "400 Invalid Query" });
  }
  const offset = parsedPage - 1;
  const queryParams = [];
  let queryStr = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id`;

  let countCatQueryStr = `SELECT COUNT(review_id) AS total_count FROM categories JOIN reviews ON categories.slug = reviews.category WHERE slug= $1 GROUP BY (slug)`;
  if (category) {
    queryParams.push(category);
    queryStr += ` WHERE category = $1`;
  }

  if (sort_by === "comment_count") {
    queryStr += ` GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order}
      LIMIT ${parsedLimit}`;
  } else {
    queryStr += ` GROUP BY reviews.review_id
      ORDER BY reviews.${sort_by} ${order}
      LIMIT ${parsedLimit}`;
  }

  if (offset > 0) {
    queryStr += ` OFFSET ${offset * parsedLimit};`;
  } else {
    queryStr += `;`;
  }

  const dataPromise = db.query(queryStr, queryParams);
  const totalCountPromise = category
    ? db.query(countCatQueryStr, queryParams)
    : db.query(
        `SELECT COUNT(review_id) AS total_count
  FROM reviews;`
      );

  return Promise.all([dataPromise, totalCountPromise]).then(
    ([dataPromise, totalCountPromise]) => {
      const { rows } = dataPromise;
      const total_count = totalCountPromise.rows[0]?.total_count || "0";

      return { rows, total_count };
    }
  );
};
