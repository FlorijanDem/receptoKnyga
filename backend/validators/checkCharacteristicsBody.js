const { body, checkExact } = require("express-validator");

exports.checkCreateCharacteristicsBody = [
  body("height")
    .trim()
    .notEmpty()
    .withMessage("Height is required")
    .isFloat({ min: 50, max: 250 })
    .withMessage("Height must be a number between 50 and 250"),

  body("weight")
    .trim()
    .notEmpty()
    .withMessage("Weight is required")
    .isFloat({ min: 10, max: 250 })
    .withMessage("Weight must be a number between 10 and 250"),

  body("age")
    .trim()
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 5, max: 120 })
    .withMessage("Age must be a number between 5 and 120"),

  body("gender")
    .trim()
    .isString()
    .withMessage("Gender is required")
    .isLength({ max: 25 })
    .withMessage("Gender must have a maximum length of 25 characters"),

  checkExact([], {
    message: (fields) =>
      fields.map((field) => `Invalid field: ${field.path}`).join("; "),
  }),
];

exports.checkUpdateCharacteristicsBody = [
  body("height")
    .optional()
    .isFloat({ min: 50, max: 250 })
    .withMessage("Height must be a number between 50 and 250"),

  body("weight")
    .optional()
    .isFloat({ min: 10, max: 250 })
    .withMessage("Weight must be a number between 10 and 250"),

  body("age")
    .optional()
    .isInt({ min: 5, max: 120 })
    .withMessage("Age must be a number between 5 and 120"),

  body("gender")
    .optional()
    .isString()
    .withMessage("Gender is required")
    .isLength({ max: 25 })
    .withMessage("Gender must have a maximum length of 25 characters"),

  checkExact([], {
    message: (fields) =>
      fields.map((field) => `Invalid field: ${field.path}`).join("; "),
  }),
];
