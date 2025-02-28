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
const { checkRecipeParams } = require("../validators/checkRecipesParams");
const { checkRecipeQuery } = require("../validators/checkRecipesQuery");
const validate = require("../validators/validate");

// Need to add protect function to most routes

recipeRouter
  .route("/")
  .get(checkRecipeQuery, validate, getAllRecipesHandler)
  .post(protect, checkCreateRecipesBody, validate, createRecipeHandler);

recipeRouter
  .route("/:id")
  .all(protect, checkRecipeParams, validate)
  .get(getRecipeByIdHandler)
  .patch(checkUpdateRecipesBody, validate, updateRecipeHandler)
  .delete(deleteRecipeHandler);

module.exports = recipeRouter;
