const express = require("express");
const router = express.Router();

const {
  testUsersRoute,
  allusers,
  signUp,
  login,
} = require("../controller/users");

router.route("/test").get(testUsersRoute);
router.route("/allusers").get(allusers);
router.route("/signup").post(signUp);
router.route("/login").post(login);
module.exports = router;
