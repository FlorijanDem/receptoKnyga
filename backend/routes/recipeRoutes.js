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
const { checkRecipeQuery } = require("../validators/checkRecipesQuery");
const validate = require("../validators/validate");

// Need to add protect function to moct routes

recipeRouter
  .route("/")
  .get(checkRecipeQuery, validate, getAllRecipesHandler)
  .post(checkCreateRecipesBody, validate, createRecipeHandler);

recipeRouter
  .route("/:id")
  .all(checkRecipeParams, validate)
  .get(getRecipeByIdHandler)
  .patch(checkUpdateRecipesBody, validate, updateRecipeHandler)
  .delete(deleteRecipeHandler);

module.exports = recipeRouter;
