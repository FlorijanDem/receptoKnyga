const express = require("express");
const { protect } = require("../controllers/userController");
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getAllFavorites,
} = require("../controllers/favoriteController");
const {
  checkAddFavorite,
  checkRemoveFavorite,
  checkGetUserFavorites,
  checkGetAllFavorites,
} = require("../validators/favoritesValidation");
const { validationResult } = require("express-validator");

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }
  next();
};

router
  .route("/")
  .get(checkGetAllFavorites, handleValidationErrors, getAllFavorites)
  .post(protect, checkAddFavorite, handleValidationErrors, addFavorite);

router
  .route("/:userId")
  .get(checkGetUserFavorites, handleValidationErrors, getUserFavorites);

router
  .route("/:recipeId")
  .delete(protect, checkRemoveFavorite, handleValidationErrors, removeFavorite);

module.exports = router;
