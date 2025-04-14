const AppError = require("../utils/appError");
const {
  registerUser,
  getUserByEmail,
  getUserByid,
  updateUser,
  getAllUsers,
  countUsers,
} = require("../models/userModel");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { sql } = require("../dbConnection");
const sendEmail = require("../utils/sendEmail");

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

    const token = signToken(user.id);
    sendCookie(token, res);

    //  user.id = undefined;

    user.password = undefined;

    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await argon2.verify(user.password, password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = signToken(user.id);
    sendCookie(token, res);


    // user.id = undefined;
    user.password = undefined;

    res.status(200).json({
      message: "You are login",
      user,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
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
    next(new AppError(err.message, 500));
  }
};

exports.allowAccessTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to access this route", 403)
      );
    }
    next();
  };
};

exports.getMe = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(200).json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserByid(decoded?.id);

    if (!user) {
      return res.status(200).json({ user: null });
    }

    //  user.password = undefined;

    res.status(200).json({ user });
  } catch (err) {
    next(new AppError(err.message, 401));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const user = await updateUser(data, id);

    user.password = undefined;

    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers(req.query);
    const count = await countUsers(req.query);

    users.forEach((user) => {
      user.password = undefined;
    });

    res.status(200).json({ status: "success", count, data: users });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await getUserByid(req.user.id);

    const isPasswordCorrect = await argon2.verify(
      user.password,
      currentPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${req.user.id}
    `;

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
exports.forgotPassword = async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      text: `Click this link to reset your password: ${resetLink}`,
    });
    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await getUserByid(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPreviousPassword = await argon2.verify(user.password, newPassword);
    if (isPreviousPassword) {
      return res.status(400).json({ 
        message: "New password cannot be the same as your current password" 
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    await sql`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE id = ${userId}
        `;

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
