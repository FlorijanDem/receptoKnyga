const AppError = require("../utils/appError");

exports.validateAddFavorite = (req, res, next) => {
  const { recipeId } = req.body;

  if (!recipeId) {
    return next(new AppError("Recipe ID is required", 400));
  }

  next();
};

exports.validateRemoveFavorite = (req, res, next) => {
  const recipeId = req.params.recipeId;

  if (!recipeId) {
    return next(new AppError("Recipe ID is required", 400));
  }

  next();
};

exports.validateGetUserFavorites = (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  next();
};
