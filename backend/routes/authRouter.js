const express = require("express");
const { registerUser } = require("../controllers/userController");
const validate = require("../validators/validate");
const { checkRegisterBody } = require("../validators/checkRegisterBody");

const authRouter = express.Router();

authRouter.route("/register").post(checkRegisterBody, validate, registerUser);

module.exports = authRouter;
