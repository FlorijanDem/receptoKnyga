const { body, param } = require("express-validator");

exports.checkAddFavorite = [
  body("recipeId")
    .exists()
    .withMessage("Recipe ID is required")
    .isString()
    .withMessage("Recipe ID must be a string")
    .trim()
    .notEmpty()
    .withMessage("Recipe ID cannot be empty"),
];

exports.checkRemoveFavorite = [
  param("recipeId")
    .exists()
    .withMessage("Recipe ID is required")
    .isString()
    .withMessage("Recipe ID must be a string")
    .trim()
    .notEmpty()
    .withMessage("Recipe ID cannot be empty"),
];

exports.checkGetUserFavorites = [
  param("userId")
    .exists()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string")
    .trim()
    .notEmpty()
    .withMessage("User ID cannot be empty"),
];

exports.checkGetAllFavorites = [];
