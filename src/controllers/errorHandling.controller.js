exports.invalidPathError = (req, res, next) => {
  res.status(404).send({ msg: "404 Path Not Found" });
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code) {
    switch (err.code) {
      case "22P02":
        res.status(400).send({ msg: "400 Bad Request" });
        break;
      case "23502":
        res.status(400).send({
          msg: "400 Bad Request. null value violates not-null constraint",
        });
        break;
      case "ERR_HTTP_HEADERS_SENT":
        break;
      default:
        next(err);
        break;
    }
  } else {
    next(err);
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.uncaughtErrors = (err, req, res, next) => {
  if (err) {
    res.status(500).send({ msg: `${err}` });
  }
};
