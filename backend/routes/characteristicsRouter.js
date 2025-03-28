// characteristicsRouter.js
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
  .get(protect, getWeightHistory) // GET /api/v1/characteristics/weight-history
  .post(protect, addWeight) // POST /api/v1/characteristics/weight-history
  .patch(protect, updateWeight); // PATCH /api/v1/characteristics/weight-history

module.exports = characteristicsRouter;
