const { body } = require("express-validator");

exports.checkReviewsBody = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
  body("review_text")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Review text must be 1-500 characters")
    .custom((value) => {
      const zalgoRegex =
        /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\uFE20-\uFE2F]/;
      if (zalgoRegex.test(value)) {
        throw new Error("Zalgo text is not allowed!");
      }
      return true;
    }),
  body("approved")
    .optional()
    .trim()
    .isBoolean()
    .withMessage("Approved must be a boolean")
    .custom((_value, { req }) => {
      if (req.user.role !== "admin") {
        throw new Error("User is not an admin");
      }

      return true;
    }),
];
