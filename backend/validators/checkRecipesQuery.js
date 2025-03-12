const { query, checkExact } = require("express-validator");

exports.checkRecipeQuery = [
  // Paieškos ir filtravimo parametrai
  query("q")
    .optional()
    .trim()
    .isString()
    .withMessage("Search query must be a string")
    .isLength({ min: 3 })
    .withMessage("Search query must be at least 3 characters long"),

  query("type")
    .optional()
    .trim()
    .toLowerCase()
    .isIn(["veg", "non-veg"])
    .withMessage('Recipe type must be either "veg" or "non-veg"'),

  query("product")
    .optional()
    .trim()
    .isString()
    .withMessage("Product must be a string")
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters long"),

  query("preparation_time")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Preparation time must be a positive integer"),

  query("servings")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Servings must be a positive integer"),

  // Puslapiavimo parametrai
  query("page")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Page number must be a positive integer"),

  query("limit")
    .optional()
    .trim()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),

  // Rūšiavimo parametrai
  query("sortBy")
    .optional()
    .trim()
    .isIn(["title", "preparationTime", "servings", "similarity_score"])
    .withMessage("Invalid sort by field"),

  query("order")
    .optional()
    .trim()
    .toUpperCase()
    .isIn(["ASC", "DESC"])
    .withMessage("Order must be either ASC or DESC"),

  // Užtikriname, kad nėra papildomų nenumatytų parametrų
  checkExact([], {
    message: (fields) =>
      fields
        .map((field) => `Invalid query parameter: ${field.path}`)
        .join("; "),
  }),
];
