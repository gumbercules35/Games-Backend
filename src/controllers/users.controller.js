const { fetchUsers } = require(`${__dirname}/../models/fetchUsers.model.js`);
exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};
