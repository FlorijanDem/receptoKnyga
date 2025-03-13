const express = require("express");
const characteristicsRouter = express.Router();
//import controller
const {
  updateCharacteristic,
  getUserCharacteristicsMy,
  createCharacteristic,
} = require("../controllers/characteristicsController");
//import body validator
const {
  checkUpdateCharacteristicsBody,
} = require("../validators/checkCharacteristicsBody");
//import user protect controller
const { protect } = require("../controllers/userController");
// validator
const validate = require("../validators/validate");


//Get user characteristics by route /
characteristicsRouter
  .route("/")
  .get(protect, getUserCharacteristicsMy)
  .post(protect, createCharacteristic)
  .patch(
    protect,
    checkUpdateCharacteristicsBody,
    validate,
    updateCharacteristic
  )

module.exports = characteristicsRouter;
