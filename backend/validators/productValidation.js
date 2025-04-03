const { query } = require("express-validator");

// Validation rules for product search
exports.checkProductSearchQuery = [
  query("q")
    .isString()
    .withMessage("Query must be a string")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Query must be at least 2 characters long"),
];

