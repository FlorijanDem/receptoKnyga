const activityLevelRouter = require("express").Router();
const {
  getAllActivityLevels,
} = require("../controllers/activityLevelController");

activityLevelRouter.route("/").get(getAllActivityLevels);

module.exports = activityLevelRouter;
