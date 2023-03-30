const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchUserByUsername = (username) => {
  return db
    .query(
      `SELECT * 
    FROM users 
    WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      } else {
        return rows[0];
      }
    });
};
