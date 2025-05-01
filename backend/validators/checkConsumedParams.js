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

exports.checkWeeklyDateParam = [
  param("startDate")
    .exists()
    .withMessage("Start date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid date format. Use YYYY-MM-DD")
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return true;
    }),

  param("startDate").custom((value) => {
    const inputDate = new Date(value);
    inputDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (inputDate >= tomorrow) {
      throw new Error("You want to check a future date");
    }
    return true;
  }),
];

exports.checkDeleteParams = [
  param("consumedId").isInt({ min: 1 }).withMessage("Invalid consumed ID"),
];
