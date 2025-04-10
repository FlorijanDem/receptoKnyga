const express = require("express");
const characteristicsRouter = express.Router();
const {
  updateCharacteristic,
  getUserCharacteristicsMy,
} = require("../controllers/characteristicsController");
const {
  getWeightHistory,
  addWeight,
  updateWeight,
} = require("../controllers/characteristicsHistoryController");
const {
  checkUpdateCharacteristicsBody,
} = require("../validators/checkCharacteristicsBody");
const {
  checkAddWeightBody,
  checkUpdateWeightBody,
} = require("../validators/checkCharacteristicsHistoryBody");
const { protect } = require("../controllers/userController");
const validate = require("../validators/validate");

characteristicsRouter
  .route("/")
  .get(protect, getUserCharacteristicsMy)
  .patch(
    protect,
    checkUpdateCharacteristicsBody,
    validate,
    updateCharacteristic
  );

characteristicsRouter
  .route("/history")
  .get(protect, getWeightHistory)
  .post(protect, checkAddWeightBody, validate, addWeight)
  .patch(protect, checkUpdateWeightBody, validate, updateWeight);

module.exports = characteristicsRouter;
