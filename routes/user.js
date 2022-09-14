const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const flash = require("connect-flash");
const catchAsync = require("../utils/catchAsync");
const controllers = require("../Controllers/userControl");

router
  .route("/register")
  .get(controllers.registerForm)
  .post(catchAsync(controllers.registerUser));

router
  .route("/login")
  .get(controllers.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    controllers.loginUser
  );

router.get("/logout", controllers.logout);

module.exports = router;
