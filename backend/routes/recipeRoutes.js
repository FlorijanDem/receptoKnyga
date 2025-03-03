const recipeRouter = require("express").Router();
const {
  getAllRecipesHandler,
  getRecipeByIdHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
} = require("../controllers/recipeController");
const { protect } = require("../controllers/userController");
const {
  checkCreateRecipesBody,
  checkUpdateRecipesBody,
} = require("../validators/checkRecipesBody");
const {
  checkRecipeParams,
  checkRecipeCreator,
} = require("../validators/checkRecipesParams");
const { checkRecipeQuery } = require("../validators/checkRecipesQuery");
const validate = require("../validators/validate");

recipeRouter
  .route("/")
  .get(checkRecipeQuery, validate, getAllRecipesHandler)
  .post(protect, checkCreateRecipesBody, validate, createRecipeHandler);

recipeRouter
  .route("/:id")
  .all(protect, checkRecipeParams, validate)
  .get(getRecipeByIdHandler)
  .patch(
    checkRecipeCreator,
    checkUpdateRecipesBody,
    validate,
    updateRecipeHandler
  )
  .delete(checkRecipeCreator, validate, deleteRecipeHandler);

module.exports = recipeRouter;
