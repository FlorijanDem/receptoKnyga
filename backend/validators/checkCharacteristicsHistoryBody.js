const { body, checkExact } = require("express-validator");

exports.checkAddWeightBody = [
  body("weight")
    .trim()
    .isFloat({ min: 10, max: 500 })
    .withMessage("Weight must be a number between 10 and 500"),

  body("date")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date string"),

  checkExact([], {
    message: (fields) =>
      fields.map((field) => `Invalid field: ${field.path}`).join("; "),
  }),
];

exports.checkUpdateWeightBody = [
  body("entryId")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Entry ID must be a positive integer"),

  body("weight")
    .trim()
    .isFloat({ min: 10, max: 500 })
    .withMessage("Weight must be a number between 10 and 500"),

  body("date")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date string"),

  checkExact([], {
    message: (fields) =>
      fields.map((field) => `Invalid field: ${field.path}`).join("; "),
  }),
];
