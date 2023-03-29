const {
  fetchUsers,
  fetchUserByUsername,
} = require(`${__dirname}/../models/index.model.js`);

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  console.log("contrl");
  const { username } = req.params;
  fetchUserByUsername(username).then((user) => {
    res.status(200).send({ user });
  });
};
