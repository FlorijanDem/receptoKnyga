const { body } = require("express-validator");
const { getUserByUsername, getUserByEmail } = require("../models/userModel");
exports.checkRegisterBody = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`"username" must not be empty`)
    .isString()
    .withMessage(`"username" must be a string`)
    .isLength({ min: 3 })
    .withMessage(`"username" must have a minimum length of 3 characters`)
    // Username only 30 characters because in the futere our team planned to make
    // something like social network with public usernames.
    // Long username can just make some problems.
    .isLength({ max: 30 })
    .withMessage(`"username" must have a maximum length of 30 characters`)
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
    .withMessage(`"password" must not be empty`)
    .isString()
    .withMessage(`"password" must be a string`)
    .isLength({ min: 6 })
    .withMessage(`"password" must have a minimum length of 6 characters`)
    .isLength({ max: 20 })
    .withMessage(`"password"must have a maximum length of 20 characters`)
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    .withMessage("Password must contain only letters and at least one number"),

  body("password-confirm")
    .trim()
    .notEmpty()
    .withMessage(`"password-confirm" must not be empty`)
    .isString()
    .withMessage(`"password-confirm" must be a string`)
    .isLength({ min: 6 })
    .withMessage(`"password-confirm" must be a minimum length of 6 characters`)
    .isLength({ max: 20 })
    .withMessage(`"password-confirm" must be a maximum length of 20 characters`)
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    .withMessage("Password must contain only letters and at least one number")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage(`"email" must not be empty`)
    .isString()
    .withMessage(`"email" must be s string`)
    .isEmail()
    .withMessage("Must be a valid email format")
    .isLength({ max: 255 })
    .withMessage(`"email" must be a maximum length of 255 characters`)
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
