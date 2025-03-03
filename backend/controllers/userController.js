const AppError = require("../utils/appError");
const {
  registerUser,
  getUserByEmail,
  getUserByid,
} = require("../models/userModel");
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

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    const isPasswordCorrect = await argon2.verify(user.password, password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = signToken(user.id);
    sendCookie(token, res);
    res.status(200).json({
      message: "You are logged in!",
    });
  } catch (err) {
    console.error(err);
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({
    message: "You are logout",
  });
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserByid(decoded?.id);

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new AppError(err.message, 401));
  }
};
