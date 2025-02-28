const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

const validate = (req, res, next) => {
  try {
    const errors = validationResult(req);

    const errorsString = errors
      .array()
      .map((error) => error.msg)
      .join("; ");

    if (!errors.isEmpty()) {
      throw new AppError(errorsString, 400);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
