const { protect, allowAccessTo } = require("../controllers/userController");
const { updateUser, getAllUsers } = require("../controllers/userController");
const { checkUpdateUserBody } = require("../validators/checkUsersBody");
const {
  checkUserParams,
  checkBanUserParams,
} = require("../validators/checkUsersParams");
const validate = require("../validators/validate");

const userRouter = require("express").Router();

userRouter
  .route("/")
  .get(protect, allowAccessTo("admin"), validate, getAllUsers);

userRouter
  .route("/:id")
  .patch(
    protect,
    checkUserParams,
    checkBanUserParams,
    checkUpdateUserBody,
    validate,
    updateUser
  );

module.exports = userRouter;
