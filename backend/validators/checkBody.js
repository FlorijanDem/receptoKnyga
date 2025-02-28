const {body} = require("express-validator");

exports.checkRegisterBody = [
    body("username")
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .isString()
    .withMessage("Minimum length of 3 characters"),

  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 20 })
    .isString()
    .withMessage("Minimum length of 6 characters."),

  body("email")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Must be a valid email format"),
]