const {
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
} = require("../models/recipeModel");

exports.getAllRecipesHandler = async (req, res, next) => {
  try {
    const { q, type, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { recipes, total } = await searchRecipes({
      q: q?.trim(),
      type: type?.toLowerCase(),
      limit: parseInt(limit),
      offset: offset,
      sortBy: q ? 'similarity_score' : 'title',
      order: q ? 'DESC' : 'ASC'
    });

    res.status(200).json({
      status: "success",
      results: total,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

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
