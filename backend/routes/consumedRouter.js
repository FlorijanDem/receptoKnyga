const {
  getUserConsumed,
  addConsumed,
  deleteConsumed,
  userMacros,
  userWeeklyMacros,
  searchRecipesHandler,
} = require("../controllers/consumedController");
const { protect } = require("../controllers/userController");
const {
  checkDateParam,
  checkDeleteParams,
  checkWeeklyDateParam,
} = require("../validators/checkConsumedParams");
const { checkProductSearchQuery } = require("../validators/productValidation");
const { checkConsumedBody } = require("../validators/checkConsumedBody");
const validate = require("../validators/validate");

const consumedRouter = require("express").Router();

consumedRouter.get(
  "/search",
  protect,
  checkProductSearchQuery,
  validate,
  searchRecipesHandler
);

consumedRouter
  .route("/:date?")
  .get(protect, checkDateParam, validate, getUserConsumed);

consumedRouter
  .route("/macros/:date?")
  .get(protect, checkDateParam, validate, userMacros);

consumedRouter
  .route("/weekly-macros/:startDate")
  .get(protect, checkWeeklyDateParam, validate, userWeeklyMacros);

consumedRouter
  .route("/")
  .post(protect, checkConsumedBody, validate, addConsumed);

consumedRouter
  .route("/:consumedId")
  .delete(protect, checkDeleteParams, validate, deleteConsumed);

module.exports = consumedRouter;
