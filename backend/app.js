const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");
const authRouter = require("./routes/authRouter");
const recipeRouter = require("./routes/recipeRoutes");
const characteristicsRouter = require("./routes/characteristicsRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRouter");
const consumedRouter = require("./routes/consumedRouter");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/characteristics", characteristicsRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/consumed", consumedRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

module.exports = app;
