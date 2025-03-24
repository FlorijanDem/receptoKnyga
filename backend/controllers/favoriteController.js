const AppError = require("../utils/appError");
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getAllFavorites: getAllFavoritesModel, // Renamed for clarity
} = require("../models/favoriteModel");

exports.addFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.body;

    if (!recipeId) {
      return next(new AppError("Recipe ID is required", 400));
    }

    const favorite = await addFavorite(userId, recipeId);

    res.status(201).json({
      status: "success",
      data: favorite,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const favorite = await removeFavorite(userId, recipeId);

    if (!favorite) {
      return next(new AppError("Favorite not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Recipe removed from favorites",
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

// Updated: Get favorites for a specific user by userId (moved from previous getFavorites)
exports.getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Changed to use URL param instead of req.user.id
    const favorites = await getUserFavorites(userId);

    res.status(200).json({
      status: "success",
      data: favorites,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

// New: Get all users and their favorite recipes
exports.getAllFavorites = async (req, res, next) => {
  try {
    const favorites = await getAllFavoritesModel();

    res.status(200).json({
      status: "success",
      data: favorites,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};
