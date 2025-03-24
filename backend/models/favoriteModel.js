const { sql } = require("../dbConnection");

exports.addFavorite = async (userId, recipeId) => {
  const [favorite] = await sql`
    INSERT INTO favorite_recipes (user_id, recipe_id)
    VALUES (${userId}, ${recipeId})
    RETURNING *
  `;
  return favorite;
};

exports.removeFavorite = async (userId, recipeId) => {
  const [favorite] = await sql`
    DELETE FROM favorite_recipes
    WHERE user_id = ${userId} AND recipe_id = ${recipeId}
    RETURNING *
  `;
  return favorite;
};

exports.getUserFavorites = async (userId) => {
  const favorites = await sql`
    SELECT recipe_id
    FROM favorite_recipes
    WHERE user_id = ${userId}
  `;
  return favorites.map((f) => f.recipe_id);
};

// New function to get all users and their favorite recipes
exports.getAllFavorites = async () => {
  const favorites = await sql`
    SELECT user_id, ARRAY_AGG(recipe_id) AS recipe_ids
    FROM favorite_recipes
    GROUP BY user_id
  `;
  return favorites;
};
