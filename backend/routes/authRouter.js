const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getMe,
  protect,
  updatePassword,
} = require("../controllers/userController");
const validate = require("../validators/validate");
const { checkRegisterBody } = require("../validators/checkRegisterBody");
const { checkLoginBody } = require("../validators/checkLoginBody");

const authRouter = express.Router();

authRouter.route("/register").post(checkRegisterBody, validate, registerUser);
authRouter.route("/login").post(checkLoginBody, validate, loginUser);
authRouter.route("/logout").post(logout);
authRouter.route("/me").get(getMe);
authRouter.route("/updatePassword").patch(protect, updatePassword);

module.exports = authRouter;
