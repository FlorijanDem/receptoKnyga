const { body, checkExact } = require("express-validator");

// Need to add validation by user

exports.checkCreateRecipesBody = [
  body("title").trim().isString({ min: 3 }).withMessage("Title is required"),

  body("photo").trim().isString().withMessage("Photo is required"),

  body("description")
    .trim()
    .isString({ min: 5 })
    .withMessage("Description is required"),

  body("method").trim().isString({ min: 5 }).withMessage("Method is required"),

  body("type")
    .trim()
    .isString({ min: 3 })
    .isIn(["veg", "non-veg"])
    .withMessage("Type is required and must be 'veg' or 'non-veg' type"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),

  body("preparation_time")
    .trim()
    .isInt({ min: 1, max: 60 * 24 })
    .withMessage(
      "Preparation time is required and must be at least 1 minute and at most 24 hours"
    ),

  body("servings")
    .trim()
    .isInt({ min: 1, max: 20 })
    .withMessage("Servings is required and must be at least 1 and at most 20"),

  checkExact([], {
    message: (fields) =>
      fields.map((field) => `Invalid field: ${field.path}`).join("; "),
  }),
];

exports.checkUpdateRecipesBody = [
  body("title").optional().trim().isString({ min: 3 }),

  body("photo").optional().trim().isString(),

  body("description").optional().trim().isString({ min: 5 }),

  body("method").optional().trim().isString({ min: 5 }),

  body("type").optional().trim().isString({ min: 3 }),

  body("products").optional().isArray({ min: 1 }),

  body("preparation_time")
    .optional()
    .trim()
    .isInt({ min: 1, max: 60 * 24 })
    .withMessage(
      "Preparation time is required and must be at least 1 minute and at most 24 hours"
    ),

  body("servings")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .isInt({ min: 1, max: 20 })
    .withMessage("Servings is required and must be at least 1 and at most 20"),

  body("approved").optional().isBoolean(),

  checkExact([], {
    message: (fields) =>
      fields.map((field) => `Invalid field: ${field.path}`).join("; "),
  }),
];
