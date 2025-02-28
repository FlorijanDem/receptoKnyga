const AppError = require("../utils/appError");
const { registerUser } = require("../models/userModel");

const argon2 = require("argon2");

exports.registerUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    const hashedPassword = await argon2.hash(newUser.password);
    newUser.password = hashedPassword;
    const user = await registerUser({ newUser });

    user.id = undefined;
    user.password = undefined;

    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
  }
};
