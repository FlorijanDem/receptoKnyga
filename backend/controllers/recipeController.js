const {
  getAllRecipes,
  getRecipeById,
  getRecipesCount,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
} = require("../models/recipeModel");

exports.getAllRecipesHandler = async (req, res, next) => {
  try {
    const searchString = Object.entries(req.query)
      .map(([key, value]) => `${key} ILIKE '%${value}%'`)
      .join(" AND ");

    const filter = {
      limit: req.query.limit || 10,
      offset: (req.query.page - 1) * req.query.limit || 0,
      sortBy: req.query.sortBy || "title",
      order: req.query.order || "asc",
      searchString,
    };

    const recipes = await getAllRecipes(filter);

    const recipesCount = await getRecipesCount(filter);

    res.status(200).json({
      status: "success",
      results: recipesCount,
      data: recipes,
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

exports.searchRecipesHandler = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Paieškos užklausa negali būti tuščia",
      });
    }

    const recipes = await searchRecipes(q.trim());

    res.status(200).json({
      status: "success",
      results: recipes.length,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};
