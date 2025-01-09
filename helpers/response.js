const SuccessResponse = (res, code, msg, data) => {
  const meta = {
    status: "Success",
    code,
    msg,
    date: new Date(),
  };

  const result = {
    meta,
    data,
    error: null,
  };

  res.status(code).json(result);
};

const ErrorResponse = (code, msg) => {
  return {status: code, message: msg};
};

module.exports = {
  SuccessResponse,
  ErrorResponse,
};
