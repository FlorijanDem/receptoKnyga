const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getAllFavorites: getAllFavoritesModel,
} = require("../models/favoriteModel");

exports.addFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.body;

    const favorite = await addFavorite(userId, recipeId);

    res.status(201).json({
      status: "success",
      data: favorite,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const favorite = await removeFavorite(userId, recipeId);

    res.status(200).json({
      status: "success",
      message: "Recipe removed from favorites",
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const favorites = await getUserFavorites(userId);

    res.status(200).json({
      status: "success",
      data: favorites,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllFavorites = async (req, res, next) => {
  try {
    const favorites = await getAllFavoritesModel();

    res.status(200).json({
      status: "success",
      data: favorites,
    });
  } catch (err) {
    next(err);
  }
};
