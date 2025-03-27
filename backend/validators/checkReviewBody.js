const { body } = require("express-validator");

exports.checkReviewsBody = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
  body("review_text")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Review text must be 1-500 characters"),
];
