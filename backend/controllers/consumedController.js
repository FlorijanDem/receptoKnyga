const {
  getUserConsumed,
  addConsumed,
  deleteConsumed,
  userMacros,
  userWeeklyMacros,
  searchRecipes,
} = require("../models/consumedModel");

exports.addConsumed = async (req, res, next) => {
  try {
    const { datetime, recipeTitle } = req.body;
    const result = await addConsumed(req.user.id, recipeTitle, datetime);

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteConsumed = async (req, res, next) => {
  try {
    const { consumedId } = req.params;
    const deleted = await deleteConsumed(consumedId, req.user.id);
    if (!deleted || deleted.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Entry not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: deleted[0],
    });
  } catch (err) {
    next(err);
  }
};

exports.userMacros = async (req, res, next) => {
  try {
    const { date } = req.params;
    const result = await userMacros(req.user.id, date);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.userWeeklyMacros = async (req, res, next) => {
  try {
    const { startDate } = req.params;
    const result = await userWeeklyMacros(req.user.id, startDate);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.searchRecipesHandler = async (req, res) => {
  try {
    const { q } = req.query;

    // Check if q parameter is provided
    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Search query parameter 'q' is required",
      });
    }

    const products = await searchRecipes(q);

    return res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to search products",
    });
  }
};

exports.getUserConsumed = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { date } = req.params;

    if (!date) {
      const today = new Date();
      date = today.toISOString().split("T")[0];
    }
    const macros = await getUserConsumed(userId, date);
    res.status(200).json({
      status: "success",
      results: macros.length,
      data: macros,
    });
  } catch (err) {
    next(err);
  }
};
