const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchCategories = () => {
  return db
    .query(
      `SELECT slug, description
    FROM categories;`
    )
    .then(({ rows }) => rows);
};
