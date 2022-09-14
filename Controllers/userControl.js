const User = require("../models/user");
const passport = require("passport");
const flash = require("connect-flash");

module.exports.registerForm = (req, res) => {
  res.render("User/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome!");
      console.log(user);
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("User/login");
};

module.exports.loginUser = (req, res) => {
  // res.send(`Hey ${req.user.username}, welcome back`);
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
};
