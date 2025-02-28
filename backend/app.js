const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");
const authRouter = require("./routes/authRouter");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

module.exports = app;
