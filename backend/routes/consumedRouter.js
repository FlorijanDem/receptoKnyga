const {
  getUserConsumed,
  addConsumed,
  deleteConsumed,
} = require("../controllers/consumedController");
const { protect } = require("../controllers/userController");
const {
  checkDateParam,
  checkDeleteParams,
} = require("../validators/checkConsumedParams");
const { checkConsumedBody } = require("../validators/checkConsumedBody");
const validate = require("../validators/validate");

const consumedRouter = require("express").Router();

consumedRouter
  .route("/:date?")
  .get(protect, checkDateParam, getUserConsumed);

consumedRouter
  .route("/")
  .post(protect, checkConsumedBody, validate, addConsumed);

consumedRouter
  .route("/:consumedId")
  .delete(protect, checkDeleteParams, validate, deleteConsumed);

module.exports = consumedRouter;
