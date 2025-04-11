const { body, validationResult } = require("express-validator");

exports.checkResetPassword = [
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isString()
    .withMessage("New password must be string")
    .isLength({ min: 6 })
    .withMessage("New Password must be at least 6 characters long")
    .isLength({ max: 20 })
    .withMessage("New password must have a maximum of 20 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    .withMessage("Password must contain only letters and at least one number"),

  body("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.body["newPassword"]) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};
