const { body } = require("express-validator");
const { getUserByEmail } = require("../models/userModel");

exports.checkLoginBody = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`"password" must not be empty`)
    .isString()
    .withMessage(`"password" must be a string`)
    .isLength({ min: 6 })
    .withMessage(`"password" must have a minimum length of 6 characters`)
    .isLength({ max: 20 })
    .withMessage(`"password" must have a maximum length of 20 characters`),

  body("email")
    .trim()
    .notEmpty()
    .withMessage(`"email" must not be empty`)
    .isString()
    .withMessage(`"email" must be a string`)
    .isEmail()
    .withMessage("Must be a valid email format")
    .isLength({ max: 255 })
    .withMessage(`"email" must have a maximum length of 255 characters`)
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (!user) throw new Error("Email does not exist");
      return true;
    }),
];
