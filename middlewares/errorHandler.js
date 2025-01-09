module.exports = (err, req, res, next) => {
  const handleCode = (code) => {
    switch (code) {
      case "SequelizeUniqueConstraintError":
        return 404;
      default:
        return 500;
    }
  };
  let code = err.status || handleCode(err?.name);
  let message = err?.message || "Internal Server Error";

  const result = {
    meta: {
      status: err?.name || "Error",
      code,
      msg: message,
      data: new Date(),
    },
    data: null,
    error: err.errors || [err],
  };
  res.status(code).json(result);
};
