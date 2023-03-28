const format = require("pg-format");
const db = require(`${__dirname}/../../db/connection.js`);

exports.checkRowExists = (column_name, row_name, row_id) => {
  const checkQueryString = format(
    `SELECT 1 FROM %1$I WHERE %2$I = %3$L`,
    column_name,
    row_name,
    row_id
  );

  return db.query(checkQueryString).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "404 Not Found" });
    }
  });
};
