const { param } = require("express-validator");
const { getRecipeById } = require("../models/recipeModel");

exports.checkRecipeParams = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid recipe ID")
    .custom(async (id) => {
      try {
        const recipe = await getRecipeById(id);
        if (!recipe) {
          throw new Error("Recipe not found");
        }

        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }),
];
