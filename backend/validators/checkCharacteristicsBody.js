const { body, checkExact } = require("express-validator");

exports.checkUpdateCharacteristicsBody = [
  body("height")
    .optional()
    .trim()
    .isFloat({ min: 50, max: 250 })
    .withMessage("Height must be a number between 50 and 250"),

  body("weight")
    .optional()
    .trim()
    .isFloat({ min: 10, max: 250 })
    .withMessage("Weight must be a number between 10 and 250"),

  body("age")
    .optional()
    .trim()
    .isInt({ min: 5, max: 120 })
    .withMessage("Age must be a number between 5 and 120"),

  body("date_of_birth").optional().trim(),

  body("gender")
    .optional()
    .trim()
    .isString()
    .withMessage("Gender is required")
    .isLength({ max: 25 })
    .withMessage("Gender must have a maximum length of 25 characters"),

  body("activity_level_id")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Activity level ID must be a positive integer"),

    body("my_goals")
    .optional()
    .trim()
    .isString()
    .withMessage("My goals"),

  checkExact([], {
    message: (fields) =>
      fields.map((field) => `Invalid field: ${field.path}`).join("; "),
  }),
];
