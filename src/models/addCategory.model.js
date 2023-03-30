const db = require(`${__dirname}/../../db/connection.js`);

exports.addCategory = ({ slug, description }) => {
  return db
    .query(
      `INSERT INTO categories
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => rows[0]);
};
