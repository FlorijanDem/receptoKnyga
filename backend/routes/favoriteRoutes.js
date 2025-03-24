const express = require("express");
const { protect } = require("../controllers/userController");
const {
  addFavorite,
  removeFavorite,
  getUserFavorites, // Renamed for clarity
  getAllFavorites,
} = require("../controllers/favoriteController");

const router = express.Router();

// Route to get all users and their favorite recipes
router.route("/").get(getAllFavorites).post(protect, addFavorite);

// Route to get a specific user's favorite recipes and delete a favorite
router.route("/:userId").get(getUserFavorites);

// Delete route remains specific to a recipeId (protected)
router.route("/:recipeId").delete(protect, removeFavorite);

module.exports = router;
