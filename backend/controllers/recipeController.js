const {
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
} = require("../models/recipeModel");

const { checkRecipeQuery } = require("../validators/checkRecipesQuery");
const validate = require("../validators/validate");

exports.getAllRecipesHandler = [
  checkRecipeQuery,
  validate,
  async (req, res, next) => {
  try {
    const { q, type, page = '1', limit = '12' } = req.query;
    // Užtikriname, kad offset bus 0 jei page/limit yra nevalidūs
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    const { recipes, total } = await searchRecipes({
      q: q?.trim(),
      type: type?.toLowerCase(),
      limit: limitNum,
      offset: offset,
      sortBy: q ? 'similarity_score' : 'title',
      order: q ? 'DESC' : 'ASC'
    });

    if (!recipes || recipes.length === 0) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: [],
        message: "No recipes found matching your criteria"
      });
    }

    res.status(200).json({
      status: "success",
      results: total,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
}];

exports.getRecipeByIdHandler = async (req, res, next) => {
  try {
    const recipe = await getRecipeById(req.params.id);

    res.status(200).json({
      status: "success",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

exports.createRecipeHandler = async (req, res, next) => {
  try {
    const newRecipe = await createRecipe({
      ...req.body,
      user_id: req.user?.id || null,
    });

    res.status(201).json({
      status: "success",
      data: newRecipe,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRecipeHandler = async (req, res, next) => {
  try {
    const updatedRecipe = await updateRecipe(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: updatedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRecipeHandler = async (req, res, next) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.id);

    res.status(200).json({
      status: "success",
      data: deletedRecipe,
    });
  } catch (error) {
    next(error);
  }
};
