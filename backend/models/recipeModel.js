const { sql } = require("../dbConnection");

// Does not work without DB

exports.getAllRecipes = async (filter) => {
  const { limit, offset, sortBy, order, searchString } = filter;

  // Needs more work on filtering
  const recipes = await sql`
    SELECT recipes.*
    FROM recipes
    JOIN recipes_products
    ON recipes.id = recipes_products.recipe_id
    JOIN products
    ON recipes_products.product_id = products.id
    ${searchString ? `WHERE ${searchString}` : ""}
    GROUP BY recipes.id
    ORDER BY ${sortBy} ${order}
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  return recipes;
};

exports.getRecipesCount = async (filter) => {
  const { searchString } = filter;

  // Needs more work on filtering
  const [{ recipesCount }] = await sql`
    SELECT COUNT(receipes.id) AS recipesCount
    FROM recipes
    JOIN recipes_products
    ON recipes.id = recipes_products.recipe_id
    JOIN products
    ON recipes_products.product_id = products.id
    ${searchString ? `WHERE ${searchString}` : ""}
    GROUP BY recipes.id
    `;

  return recipesCount;
};

exports.getRecipeById = async (id) => {
  // Needs refinment when DB is ready
  const recipe = await sql.begin(async () => {
    const [recipe] = await sql`
    SELECT *
    FROM recipes
    WHERE id = ${id}
    `;

    const productIDs = await sql`
    SELECT product_id
    FROM recipes_products
    WHERE recipe_id = ${recipe.id}
    `;

    recipe.products = await Promise.all(
      productIDs.map(async ({ product_id }) => {
        const [product] = await sql`
          SELECT *
          FROM products
          WHERE id = ${product_id}
          `;

        return product;
      })
    );

    return recipe;
  });

  return recipe;
};

exports.createRecipe = async (recipe) => {
  // Needs refinement when DB is ready
  const newRecipe = await sql`
    INSERT INTO recipes ${sql(recipe)}
    RETURNING *
    `;

  return newRecipe;
};

exports.updateRecipe = async (id, data) => {
  const columns = Object.keys(data);

  //   Needs refinement when DB is ready
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
