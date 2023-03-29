const { fetchPaths } = require(`${__dirname}/../models/fetchPaths.model.js`);

exports.getPaths = (req, res) => {
  const paths = fetchPaths();
  res.status(200).send({ paths });
};
