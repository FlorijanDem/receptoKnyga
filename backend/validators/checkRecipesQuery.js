const { query } = require("express-validator");

exports.checkRecipeQuery = [
  query("page").optional().isInt({ min: 1 }).withMessage("Invalid page number"),

  query("limit").optional().isInt({ min: 1 }).withMessage("Invalid limit"),

  query("sortBy")
    .optional()
    .isIn(["title", "preparationTime", "servings"])
    .withMessage("Invalid sort by field"),

  query("order").optional().isIn(["asc", "desc"]).withMessage("Invalid order"),

  query("search").optional().isString().withMessage("Invalid search query"),
];
