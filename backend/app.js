const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");
const authRouter = require("./routes/authRouter");
const recipeRouter = require("./routes/recipeRoutes");
const characteristicsRouter = require("./routes/characteristicsRouter");
const userRouter = require("./routes/userRouter");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, //['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/characteristics", characteristicsRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

module.exports = app;
