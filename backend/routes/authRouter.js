const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getMe,
  protect,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const validate = require("../validators/validate");
const { checkRegisterBody } = require("../validators/checkRegisterBody");
const { checkLoginBody } = require("../validators/checkLoginBody");
const { validateResetPassword, handleValidationErrors, checkResetPassword } = require("../validators/checkResetPassword");

const authRouter = express.Router();

authRouter.route("/register").post(checkRegisterBody, validate, registerUser);
authRouter.route("/login").post(checkLoginBody, validate, loginUser);
authRouter.route("/logout").post(logout);
authRouter.route("/me").get(getMe);
authRouter.route("/update-password").patch(protect, updatePassword);
authRouter.route("/forgot-password").post(forgotPassword);
authRouter.route("/reset-password/:token").post(checkResetPassword, handleValidationErrors, resetPassword);

module.exports = authRouter;
