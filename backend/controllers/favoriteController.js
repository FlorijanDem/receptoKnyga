const AppError = require("../utils/appError");
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getAllFavorites: getAllFavoritesModel,
} = require("../models/favoriteModel");
const {
  validateAddFavorite,
  validateRemoveFavorite,
  validateGetUserFavorites,
} = require("../validators/favoriteValidation");

exports.addFavorite = [
  validateAddFavorite,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { recipeId } = req.body;

      const favorite = await addFavorite(userId, recipeId);

      res.status(201).json({
        status: "success",
        data: favorite,
      });
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  },
];

exports.removeFavorite = [
  validateRemoveFavorite,
  async (req, res, next) => {
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
  },
];

exports.getUserFavorites = [
  validateGetUserFavorites,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const favorites = await getUserFavorites(userId);

      res.status(200).json({
        status: "success",
        data: favorites,
      });
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  },
];

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
