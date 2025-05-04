const { body, validationResult } = require("express-validator");
const { getUserByid } = require("../models/userModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

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
    .withMessage("Password must contain only letters and at least one number")
    .custom(async (value, { req }) => {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await getUserByid(decoded.id);
      
      if (user) {
        const isPreviousPassword = await argon2.verify(user.password, value);
        if (isPreviousPassword) {
          throw new Error("New password cannot be the same as your current password");
        }
      }
      return true;
    }),

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
