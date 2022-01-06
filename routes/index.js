var express = require("express");
var router = express.Router();

// Controller modules require
const user_controller = require("../controller/userController");
const verify = require("./verifyToken");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Login" });
});

// user register
router.post("/api/register", user_controller.user_register);
// User login
router.post("/login", user_controller.user_login);
// User direct login, auth if user has token auth-token cookie
router.get("/direct", verify, user_controller.user_direct);

router.get("/usersList", user_controller.user_findAll);

module.exports = router;
