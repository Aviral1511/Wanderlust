const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");

router.route("/signup")
.get(userController.signupFormRender)
.post(wrapAsync (userController.signupUser));

router.route("/login")
.get(userController.loginFormRender)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), wrapAsync(userController.loginUser));

router.get("/logout", userController.logoutUser);


module.exports = router;