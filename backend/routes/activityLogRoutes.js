const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { fetchLogs } = require("../controllers/activityLogController");
const { protect, allowAccessTo } = require("../controllers/userController");
const logUserActivity = require("../utils/logHelper");
const logger = require("../logger").logger;

const pageViewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.get("/", protect, allowAccessTo("admin"), fetchLogs);
router.post("/pageview", pageViewLimiter, protect, async (req, res) => {
  try {
    const { pathname } = req.body;
    if (!pathname) {
      throw new Error("Pathname is required");
    }
    await logUserActivity(req, "Visited page", pathname);
    res.sendStatus(200);
  } catch (error) {
    logger.error("[logRoutes] Failed to log page view", {
      error: error.message,
      userId: req.user?.id,
      pathname: req.body.pathname,
    });
    res.status(500).json({ error: "Failed to log page view" });
  }
});

module.exports = router;