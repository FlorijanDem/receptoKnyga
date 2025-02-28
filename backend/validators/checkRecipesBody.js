const { body, checkExact } = require("express-validator");

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

  body("preparationTime")
    .trim()
    .isNumeric({ min: 1 })
    .withMessage("Preparation time is required"),

  body("servings")
    .trim()
    .isNumeric({ min: 1 })
    .withMessage("Servings is required"),

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

  body("preparationTime").optional().trim().isNumeric({ min: 1 }),

  body("servings").optional().trim().isNumeric({ min: 1 }),

  checkExact([], {
    message: (fields) =>
      fields.map((field) => `Invalid field: ${field.path}`).join("; "),
  }),
];
