const recipeRouter = require("express").Router();
const {
  getAllRecipesHandler,
  getRecipeByIdHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
} = require("../controllers/recipeController");
const {
  checkCreateRecipesBody,
  checkUpdateRecipesBody,
} = require("../validators/checkRecipesBody");
const { checkRecipeParams } = require("../validators/checkRecipesParams");
const { validate } = require("../validators/validate");

recipeRouter
  .route("/")
  .get(getAllRecipesHandler)
  .post(checkCreateRecipesBody, validate, createRecipeHandler);

recipeRouter
  .route("/:id")
  .all(checkRecipeParams, validate)
  .get(getRecipeByIdHandler)
  .patch(checkUpdateRecipesBody, validate, updateRecipeHandler)
  .delete(deleteRecipeHandler);

module.exports = recipeRouter;
