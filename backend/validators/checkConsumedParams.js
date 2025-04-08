const { param } = require("express-validator");

exports.checkDateParam = (req, res, next) => {
  const { date } = req.params;
  if (!date) return next();

  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(date);
  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid date format. Use YYYY-MM-DD",
    });
  }

  next();
};

exports.checkDeleteParams = [
  param("consumedId").isInt({ min: 1 }).withMessage("Invalid consumed ID"),
];
