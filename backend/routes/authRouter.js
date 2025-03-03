const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
} = require("../controllers/userController");
const validate = require("../validators/validate");
const { checkRegisterBody } = require("../validators/checkRegisterBody");
const { checkLoginBody } = require("../validators/checkLoginBody");

const authRouter = express.Router();

authRouter.route("/register").post(checkRegisterBody, validate, registerUser);
authRouter.route("/login").post(checkLoginBody, validate, loginUser);
authRouter.route("/logout").post(logout);

module.exports = authRouter;
