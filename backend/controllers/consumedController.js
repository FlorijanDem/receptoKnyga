const {
  getUserConsumed,
  addConsumed,
  deleteConsumed,
} = require("../models/consumedModel");

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

exports.addConsumed = async (req, res, next) => {
  try {
    const { datetime, recipeTitle } = req.body;
    const consumed = await addConsumed(req.user.id, recipeTitle, datetime);

    res.status(201).json({
      status: "success",
      data: consumed,
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
