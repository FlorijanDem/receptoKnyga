const { param } = require("express-validator");
const { getRecipeById } = require("../models/recipeModel");
const { getUserByid } = require("../models/userModel");

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

exports.checkRecipeCreator = [
  param("id").custom(async (id, { req }) => {
    try {
      const user = await getUserByid(req.user?.id);

      if (user?.role !== "admin") {
        const recipe = await getRecipeById(id);
        if (recipe?.user_id !== req.user?.id) {
          throw new Error("You are not the creator of this recipe");
        }
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }),
];
