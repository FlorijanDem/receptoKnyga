const { protect } = require("../controllers/userController");
const { updateUser } = require("../models/userModel");
const { checkUserParams } = require("../validators/checkUsersParams");
const validate = require("../validators/validate");

const userRouter = require("express").Router();

userRouter.route("/:id").patch(protect, checkUserParams, validate, updateUser);

module.exports = userRouter;
