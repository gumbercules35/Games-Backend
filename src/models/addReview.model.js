const db = require(`${__dirname}/../../db/connection.js`);

exports.addReview = (post) => {
  const { owner, title, review_body, designer, category, review_img_url } =
    post;
  return db
    .query(
      `
  INSERT INTO reviews
  (owner, title, review_body, designer, category, review_img_url)
  VALUES
  ($1, $2, $3, $4, $5, $6)
  RETURNING review_id`,
      [owner, title, review_body, designer, category, review_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
