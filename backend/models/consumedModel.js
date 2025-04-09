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

  const [addedRecipe] = await sql`
    INSERT INTO consumed (user_id, recipe_id, datetime)
    VALUES (${userId}, ${recipe.id}, ${datetime})
    RETURNING *
  `;
  return addedRecipe;
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
  const [deleteConsumed] = await sql`
    DELETE FROM consumed 
    WHERE id = ${consumedId} 
    AND user_id = ${userId}
     RETURNING *;
  `;
  return deleteConsumed;
};

//USER MACROS CALCULATOR

exports.userMacros = async (userId, date) => {
  const macros = await sql`
  SELECT 
  consumed.user_id,
      ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.calories), 0)::NUMERIC, 0) AS calories,
      ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.fats), 0)::NUMERIC, 1) AS fats,
      ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.carbohydrates), 0)::NUMERIC, 1) AS carbohydrates,
      ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.protein), 0)::NUMERIC, 1) AS proteins
  FROM consumed
  JOIN recipes ON recipes.id = consumed.recipe_id
  JOIN recipes_products ON recipes_products.recipe_id = recipes.id
  JOIN products ON products.id = recipes_products.product_id
  WHERE consumed.user_id = ${userId} 
  AND consumed.datetime::date = ${date}
  GROUP BY consumed.user_id;
  `;

  return macros;
};

exports.userWeeklyMacros = async (userId, startDate) => {

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6); 

  const macros = await sql`
    SELECT 
      consumed.user_id,
      consumed.datetime::date AS date,
      ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.calories), 0)::NUMERIC, 0) AS calories,
      ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.fats), 0)::NUMERIC, 1) AS fats,
      ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.carbohydrates), 0)::NUMERIC, 1) AS carbohydrates,
      ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.protein), 0)::NUMERIC, 1) AS proteins
    FROM consumed
    JOIN recipes ON recipes.id = consumed.recipe_id
    JOIN recipes_products ON recipes_products.recipe_id = recipes.id
    JOIN products ON products.id = recipes_products.product_id
    WHERE consumed.user_id = ${userId}
    AND consumed.datetime::date BETWEEN ${startDate} AND ${endDate}
    GROUP BY consumed.user_id, consumed.datetime::date
    ORDER BY consumed.datetime::date;
  `;

  const result = [];
  const currentDate = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = macros.find(row => row.date.toISOString().split('T')[0] === dateStr) || {
      calories: 0,
      fats: 0,
      carbohydrates: 0,
      proteins: 0,
    };
    result.push({
      date: dateStr,
      calories: dayData.calories || 0,
      fats: dayData.fats || 0,
      carbohydrates: dayData.carbohydrates || 0,
      proteins: dayData.proteins || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};