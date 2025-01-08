const route = require("express").Router();
const UserController = require("../controllers/users");

route.post("/login", UserController.login);
route.post("/register", UserController.register);
route.get("/verifytoken", UserController.verifyToken);

module.exports = route;
