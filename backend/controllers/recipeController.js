const {
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  getAllMacros,
} = require("../models/recipeModel");

exports.getAllRecipesHandler = async (req, res, next) => {
  try {
    const { q, type, product, page = "1", limit = "12" } = req.query;
    // Užtikriname, kad offset bus 0 jei page/limit yra nevalidūs
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    const { recipes, total } = await searchRecipes({
      q: q?.trim(),
      type: type?.toLowerCase(),
      product: product?.trim(),
      limit: limitNum,
      offset: offset,
      sortBy: q ? "similarity_score" : "title",
      order: q ? "DESC" : "ASC",
    });

    if (!recipes || recipes.length === 0) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: [],
        message: "No recipes found matching your criteria",
      });
    }

    const result = await Promise.all(
      recipes.map(async (recipe) => {
        const calories = await getAllMacros(recipe.id);
        return {
          ...recipe,
          calories: calories[0]?.calories|| 0,
        };
      })
    );

    res.status(200).json({
      status: "success",
      results: total,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecipeByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeById(id);
    const macros = await getAllMacros(id);  

    const result = {
      ...recipe,
      calories: macros[0]?.calories || 0,
      fats: macros[0]?.fats || 0,
      carbohydrates: macros[0]?.carbohydrates || 0,
      proteins: macros[0]?.proteins || 0,
    };

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.createRecipeHandler = async (req, res, next) => {
  // Add default image (in the future can be change)
  if (req.body.photo === "") {
    req.body.photo =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Floris_Claesz._van_Dyck_001.jpg/960px-Floris_Claesz._van_Dyck_001.jpg";
  }
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
