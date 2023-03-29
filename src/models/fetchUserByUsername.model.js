const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchUserByUsername = (username) => {
  return db
    .query(
      `SELECT * 
    FROM users 
    WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => rows[0]);
};
