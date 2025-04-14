const { getAllActivityLevels } = require("../models/activityLevelModel");

exports.getAllActivityLevels = async (req, res, next) => {
  try {
    const activityLevels = await getAllActivityLevels();
    res.status(200).json({
      status: "success",
      data: activityLevels,
    });
  } catch (error) {
    next(error);
  }
};
