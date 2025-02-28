const { sql } = require("../dbConnection");

// Does not work without DB

exports.getAllRecipes = async (filter) => {
  const { limit, offset, sortBy, order, searchString } = filter;

  // Needs more work on filtering
  const recipes = await sql`
    SELECT recipes.*, products.*
    FROM recipes
    JOIN recipes_products
    ON recipes.id = recipes_products.recipe_id
    JOIN products
    ON recipes_products.product_id = products.id
    ${searchString ? `WHERE ${searchString}` : ""}
    ORDER BY ${sortBy} ${order}
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  return recipes;
};

exports.getRecipeById = async (id) => {
  const recipe = await sql`
    SELECT *
    FROM recipes
    WHERE id = ${id}
    `;

  return recipe;
};

exports.createRecipe = async (recipe) => {
  const newRecipe = await sql`
    INSERT INTO recipes ${sql(recipe)}
    RETURNING *
    `;

  return newRecipe;
};

exports.updateRecipe = async (id, data) => {
  const columns = Object.keys(data);

  const updatedRecipe = await sql`
    UPDATE recipes
    SET ${sql(data, columns)}
    WHERE id = ${id}
    RETURNING *
    `;

  return updatedRecipe;
};

exports.deleteRecipe = async (id) => {
  const deletedRecipe = await sql`
    DELETE FROM recipes
    WHERE id = ${id}
    RETURNING *
    `;

  return deletedRecipe;
};
