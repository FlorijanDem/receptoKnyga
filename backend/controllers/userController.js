const AppError = require("../utils/appError");
const { registerUser } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  return token;
};

const sendCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
};

exports.registerUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    const hashedPassword = await argon2.hash(newUser.password);
    newUser.password = hashedPassword;
    const user = await registerUser({ newUser });

    const token = signToken(user);
    sendCookie(token, res);

    user.id = undefined;
    user.password = undefined;

    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (err) {
    console.error(err);
  }
};
