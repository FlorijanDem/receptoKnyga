const recipeRouter = require("express").Router();
const {
  getAllRecipesHandler,
  getRecipeByIdHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
  searchRecipesHandler,
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

// Search endpoint should be above other routes to avoid authentication
recipeRouter.get("/search", searchRecipesHandler);

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
