const { sql } = require("../dbConnection");

exports.addConsumed = async (userId, recipeTitle, datetime) => {
  const [recipe] = await sql`
    SELECT id
    FROM recipes
    WHERE similarity(title, ${recipeTitle}) > 0.3
       OR title ILIKE ${"%" + recipeTitle + "%"}
    ORDER BY similarity(title, ${recipeTitle}) DESC
    LIMIT 1
  `;
  if (!recipe) throw new Error("Recipe not found");

  const [addRecipe] = await sql`
    INSERT INTO consumed (user_id, recipe_id, datetime)
    VALUES (${userId}, ${recipe.id}, ${datetime})
    RETURNING *
  `;
  return addRecipe;
};

exports.getUserConsumed = async (userId, date) => {
  const consumed = await sql`
    SELECT consumed.id, consumed.user_id, consumed.recipe_id, recipes.title,
    TO_CHAR(datetime, 'YYYY-MM-DD HH24:MI:SS') AS datetime
    FROM consumed
    JOIN recipes
    ON consumed.recipe_id = recipes.id
    WHERE consumed.user_id = ${userId}
    AND consumed.datetime::date = ${date}
    ORDER BY consumed.datetime DESC;
  `;
  return consumed;
};

exports.deleteConsumed = async (consumedId, userId) => {
  const [deleteCon] = await sql`
    DELETE FROM consumed 
    WHERE id = ${consumedId} 
    AND user_id = ${userId}
     RETURNING *;
  `;
  return deleteCon;
};
