const recipeRouter = require("express").Router();
const {
  getAllRecipesHandler,
  getRecipeByIdHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
} = require("../controllers/recipeController");

recipeRouter.route("/").get(getAllRecipesHandler).post(createRecipeHandler);

recipeRouter
  .route("/:id")
  .get(getRecipeByIdHandler)
  .patch(updateRecipeHandler)
  .delete(deleteRecipeHandler);

module.exports = recipeRouter;
