exports.invalidPathError = (req, res, next) => {
  res.status(404).send({ msg: "404 Path Not Found" });
};
