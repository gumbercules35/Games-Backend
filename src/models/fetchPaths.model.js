const paths = require(`${__dirname}/../../endpoints.json`);

exports.fetchPaths = () => {
  return paths;
};
