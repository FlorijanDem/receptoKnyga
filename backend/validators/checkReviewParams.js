const { param, validationResult } = require("express-validator");

exports.checkReviewsParams = [
  param("recipe_id").isInt().withMessage("Recipe ID must be an integer"),
  param("id").optional().isInt().withMessage("Review ID must be an integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
];
