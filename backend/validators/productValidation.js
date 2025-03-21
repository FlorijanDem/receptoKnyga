const { query } = require("express-validator");

// Validation rules for product search
exports.checkProductSearchQuery = [
  query("query")
    .isString()
    .withMessage("Query must be a string")
    .isLength({ min: 2 })
    .withMessage("Query must be at least 2 characters long")
    .trim(),
];

// Validation rules for amount input
exports.validateAmount = [
  query("amount")
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage("Amount must be a whole number between 1 and 10,000"),
];
