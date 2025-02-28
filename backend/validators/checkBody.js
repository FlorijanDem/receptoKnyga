const { body } = require("express-validator");
const { getUserByUsername, getUserByEmail } = require("../models/userModel");
exports.checkRegisterBody = [
  body("username")
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .isString()
    .withMessage("Minimum length of 3 characters")
    .custom(async (username) => {
      try {
        const user = await getUserByUsername(username);

        if (user) throw new Error("Username already exists");
        return true;
      } catch (err) {
        throw new Error(err.message);
      }
    }),

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
    .isEmail()
    .withMessage("Must be a valid email format")
    .custom(async (email) => {
      try {
        const user = await getUserByEmail(email);
        if (user) throw new Error("Email already used");
        return true;
      } catch (err) {
        throw new Error(err.message);
      }
    }),
];
