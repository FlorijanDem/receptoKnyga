const express = require("express");
const characteristicsRouter = express.Router();
//import controller
const {
  getUserCharacteristics,
  getUserCharacteristicsById,
  postCharacteristic,
  updateCharacteristic,
  deleteCharacteristic,
} = require("../controllers/characteristicsController");
//import body validator
const {
  checkCreateCharacteristicsBody,
  checkUpdateCharacteristicsBody,
} = require("../validators/checkCharacteristicsBody");
//import params validator
const {
  checkCharacteristicUser,
} = require("../validators/checkCharacteristicsParams");
//import user protect controller
const { protect } = require("../controllers/userController");
// validator
const validate = require("../validators/validate");

characteristicsRouter
  .route("/")
  .get(protect, getUserCharacteristics)
  .post(protect, checkCreateCharacteristicsBody, validate, postCharacteristic);

characteristicsRouter
  .route("/:id")
  .get(protect, checkCharacteristicUser, validate, getUserCharacteristicsById)
  .patch(
    protect,
    checkCharacteristicUser,
    checkUpdateCharacteristicsBody,
    validate,
    updateCharacteristic
  )
  .delete(protect, checkCharacteristicUser, validate, deleteCharacteristic);

module.exports = characteristicsRouter;
