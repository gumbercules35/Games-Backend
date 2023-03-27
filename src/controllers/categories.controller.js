const {
  fetchCategories,
} = require(`${__dirname}/../models/fetchCategories.model.js`);

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
