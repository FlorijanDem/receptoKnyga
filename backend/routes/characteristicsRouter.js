const express = require("express");
const characteristicsRouter = express.Router();
//import controller
const {
  getUserCharacteristicsAll,
  updateCharacteristic,
  deleteCharacteristic,
  getUserCharacteristicsMy,
} = require("../controllers/characteristicsController");
//import body validator
const {
  checkUpdateCharacteristicsBody,
} = require("../validators/checkCharacteristicsBody");
//import admin validator
const {
  checkCharacteristicAdmin,
} = require("../validators/checkCharacteristicsParams");
//import user protect controller
const { protect } = require("../controllers/userController");
// validator
const validate = require("../validators/validate");

characteristicsRouter
  .route("/admin")
  .get(protect, checkCharacteristicAdmin, validate, getUserCharacteristicsAll);

//Get user characteristics by route /my
characteristicsRouter
  .route("/my")
  .get(protect, getUserCharacteristicsMy)
  .patch(
    protect,
    checkUpdateCharacteristicsBody,
    validate,
    updateCharacteristic
  )
  .delete(protect, validate, deleteCharacteristic);

module.exports = characteristicsRouter;
