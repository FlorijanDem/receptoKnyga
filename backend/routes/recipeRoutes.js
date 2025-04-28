const recipeRouter = require("express").Router();
const {
  getAllRecipesHandler,
  getRecipeByIdHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
  getRecipeStats,
} = require("../controllers/recipeController");
const { protect, allowAccessTo } = require("../controllers/userController");
const {
  checkCreateRecipesBody,
  checkUpdateRecipesBody,
} = require("../validators/checkRecipesBody");
const {
  checkRecipeParams,
  checkRecipeCreator,
} = require("../validators/checkRecipesParams");
const { checkRecipeQuery } = require("../validators/checkRecipesQuery");
const { checkUserBanned } = require("../validators/checkUserBanned");
const validate = require("../validators/validate");

recipeRouter
  .route("/")
  .get(checkRecipeQuery, validate, getAllRecipesHandler)
  .post(
    protect,
    checkUserBanned,
    checkCreateRecipesBody,
    validate,
    createRecipeHandler
  );

recipeRouter
  .route("/stats")
  .get(protect, allowAccessTo("admin"), getRecipeStats);

recipeRouter
  .route("/:id")
  .all(protect, checkRecipeParams, validate)
  .get(getRecipeByIdHandler)
  .patch(
    checkUserBanned,
    checkRecipeCreator,
    checkUpdateRecipesBody,
    validate,
    updateRecipeHandler
  )
  .delete(checkRecipeCreator, validate, deleteRecipeHandler);

module.exports = recipeRouter;
