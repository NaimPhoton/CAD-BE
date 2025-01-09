const jwt = require("jsonwebtoken");

function signToken(payload, type) {
  switch (type) {
    case "LOGIN":
      return jwt.sign(
        {
          id: payload.id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          fullName: payload.fullName,
          email: payload.email,
        },
        process.env.SECRET
      );

    default:
      return jwt.sign(payload, process.env.SECRET);
  }
}

function verifyToken(token) {
  const decoded = jwt.verify(token, process.env.SECRET);
  return decoded;
}

module.exports = {
  signToken,
  verifyToken,
};
