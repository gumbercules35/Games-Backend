const {
  fetchCategories,
  addCategory,
  checkRowExists,
} = require(`${__dirname}/../models/index.model.js`);

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.postCategory = (req, res, next) => {
  const { body } = req;
  addCategory(body).then((category) => {
    res.status(201).send({ category });
  }).catch(err => next(err));
};
