const express = require("express");
const characteristicsRouter = express.Router();
//import controller
const {
  getUserCharacteristicsAll,
  postCharacteristic,
  updateCharacteristic,
  deleteCharacteristic,
  getUserCharacteristicsMy,
} = require("../controllers/characteristicsController");
//import body validator
const {
  checkUpdateCharacteristicsBody,
  checkCreateCharacteristicsBody,
} = require("../validators/checkCharacteristicsBody");
//import user protect controller
const { protect, allowAccessTo } = require("../controllers/userController");
// validator
const validate = require("../validators/validate");

characteristicsRouter
  .route("/admin")
  .get(protect, allowAccessTo("admin"), getUserCharacteristicsAll);

//Get user characteristics by route /my
characteristicsRouter
  .route("/my")
  .get(protect, getUserCharacteristicsMy)
  .post(protect, checkCreateCharacteristicsBody, validate, postCharacteristic)
  .patch(
    protect,
    checkUpdateCharacteristicsBody,
    validate,
    updateCharacteristic
  )
  .delete(protect, deleteCharacteristic);

module.exports = characteristicsRouter;
