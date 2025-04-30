const express = require("express");
const { fetchLogs } = require("../controllers/activityLogController");
const { protect, allowAccessTo } = require("../controllers/userController");
const {
  checkActivityLogBody,
  pageViewLimiter,
} = require("../validators/checkActivityLog");
const validate = require("../validators/validate");

const activityRouter = express.Router();

activityRouter
  .route("/")
  .get(protect, allowAccessTo("admin"), validate, fetchLogs);
activityRouter
  .route("/pageview")
  .post(pageViewLimiter, protect, validate, checkActivityLogBody);

module.exports = activityRouter;
