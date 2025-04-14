const { sql } = require("../dbConnection");

exports.searchRecipes = async (filters) => {
  const {
    q,
    type,
    product,
    preparation_time,
    servings,
    order,
    limit = 12,
    offset = 0,
    approved,
  } = filters;

  const apprStr =
    approved === "true"
      ? sql`AND r.approved`
      : approved === "false"
        ? sql`AND NOT r.approved`
        : sql``;

  const searchQuery = sql`
    WITH recipe_scores AS (
      SELECT 
        r.*,
        CASE 
          WHEN ${!!q} THEN
            GREATEST(
              similarity(r.title, ${q || ""}),
              similarity(r.description, ${q || ""}),
              COALESCE((
                SELECT MAX(similarity(p.title, ${q || ""}))
                FROM recipes_products rp
                INNER JOIN products p ON rp.product_id = p.id
                WHERE rp.recipe_id = r.id
              ), 0)
            )
          ELSE 1.0
        END as similarity_score
      FROM recipes r
      WHERE 1=1
      ${apprStr}
      ${type ? sql`AND r.type = ${type}` : sql``}
      ${preparation_time ? sql`AND r.preparation_time = ${preparation_time}` : sql``}
      ${servings ? sql`AND r.servings = ${servings}` : sql``}
      ${product
      ? sql`
        AND EXISTS (
          SELECT 1
          FROM recipes_products rp
          INNER JOIN products p ON rp.product_id = p.id
          WHERE rp.recipe_id = r.id
          AND (
            similarity(p.title, ${product}) > 0.2
            OR p.title ILIKE ${`%${product}%`}
          )
        )
      `
      : sql``
    }
      ${q
      ? sql`
        AND (
          similarity(r.title, ${q}) > 0.2
          OR r.title ILIKE ${`%${q}%`}
          OR similarity(r.description, ${q}) > 0.2
          OR r.description ILIKE ${`%${q}%`}
          OR EXISTS (
            SELECT 1 
            FROM recipes_products rp
            INNER JOIN products p ON rp.product_id = p.id
            WHERE rp.recipe_id = r.id
            AND (
              similarity(p.title, ${q}) > 0.2
              OR p.title ILIKE ${`%${q}%`}
            )
          )
        )
      `
      : sql``
    }
    )
    SELECT * FROM recipe_scores r
    ${order === 'new' ? sql`ORDER BY r.id DESC` : 
      order === 'old' ? sql`ORDER BY r.id ASC` : 
      order === 'title' ? sql`ORDER BY r.title ASC` : 
      order === 'asc' ? sql`ORDER BY r.id ASC` :
      order === 'desc' ? sql`ORDER BY r.id DESC` :
      sql`ORDER BY r.similarity_score DESC`}
    LIMIT ${limit}
    OFFSET ${offset}
`;

  const countQuery = sql`
    SELECT COUNT(*) as total 
    FROM recipes r
    WHERE 1=1
    ${apprStr}
    ${type ? sql`AND r.type = ${type}` : sql``}
    ${preparation_time ? sql`AND r.preparation_time = ${preparation_time}` : sql``}
    ${servings ? sql`AND r.servings = ${servings}` : sql``}
    ${product
      ? sql`
      AND EXISTS (
        SELECT 1 
        FROM recipes_products rp
        INNER JOIN products p ON rp.product_id = p.id
        WHERE rp.recipe_id = r.id
        AND (
          similarity(p.title, ${product}) > 0.2
          OR p.title ILIKE ${`%${product}%`}
        )
      )
    `
      : sql``
    }
    ${q
      ? sql`
      AND (
        similarity(r.title, ${q}) > 0.2
        OR r.title ILIKE ${`%${q}%`}
        OR similarity(r.description, ${q}) > 0.2
        OR r.description ILIKE ${`%${q}%`}
        OR EXISTS (
          SELECT 1 
          FROM recipes_products rp
          INNER JOIN products p ON rp.product_id = p.id
          WHERE rp.recipe_id = r.id
          AND (
            similarity(p.title, ${q}) > 0.2
            OR p.title ILIKE ${`%${q}%`}
          )
        )
      )
    `
      : sql``
    }
  `;
  const [recipes, [{ total }]] = await Promise.all([searchQuery, countQuery]);

  return {
    recipes,
    total: parseInt(total),
  };
};

exports.getRecipeById = async (id) => {
  const recipe = await sql.begin(async () => {
    const [recipe] = await sql`
    SELECT recipes.*, users.banned AS user_banned
    FROM recipes
    JOIN users
    ON recipes.user_id = users.id
    WHERE recipes.id = ${id}
    `;

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    const productIDs = await sql`
    SELECT product_id
    FROM recipes_products
    WHERE recipe_id = ${recipe?.id}
    `;

    recipe.products = await Promise.all(
      productIDs.map(async ({ product_id }) => {
        const [product] = await sql`
          SELECT products.title, recipes_products.amount
          FROM products
          JOIN recipes_products
          ON products.id = recipes_products.product_id
          WHERE products.id = ${product_id}
          AND recipes_products.recipe_id = ${recipe.id}
          `;

        return product;
      })
    );

    return recipe;
  });

  return recipe;
};

exports.createRecipe = async (recipe) => {
  const newRecipe = await sql.begin(async () => {
    const [newRecipe] = await sql`
    INSERT INTO recipes ("title","photo","method","type","preparation_time","servings", "description", "user_id", "approved")
    VALUES (${recipe.title}, ${recipe.photo}, ${recipe.method}, ${recipe.type}, ${recipe.preparation_time}, ${recipe.servings}, ${recipe.description}, ${recipe.user_id}, ${recipe.approved})

    RETURNING *
    `;

    const productIDs = await Promise.all(
      recipe.products.map(async (product) => {
        let [productID] = await sql`
        SELECT id
        FROM products
        WHERE title = ${product.title}
        `;

        const productObj = { id: productID.id, amount: product.amount };

        return productObj;
      })
    );

    await sql`
    INSERT INTO recipes_products (recipe_id, product_id, amount)
    VALUES ${sql(productIDs.map((p) => [newRecipe.id, p.id, p.amount]))}
    `;

    return newRecipe;
  });

  return newRecipe;
};

exports.updateRecipe = async (id, data) => {
  const columns = Object.keys(data).filter((key) => key !== "products");
  const updatedRecipe = await sql.begin(async () => {
    const [recipe] = await sql`
    SELECT *
    FROM recipes
    WHERE id = ${id}
    `;

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    const [updatedRecipe] = await sql`
    UPDATE recipes
    SET ${sql(data, ...columns)}
    WHERE id = ${id}
    RETURNING *
    `;

    if (data.products) {
      await sql`
      DELETE FROM recipes_products
      WHERE recipe_id = ${id}
    `;
      const productIDs = await Promise.all(
        data.products.map(async (product) => {
          let [productID] = await sql`
          SELECT id
          FROM products
          WHERE title = ${product.title}
          `;

          const productObj = { id: productID.id, amount: product.amount };

          return productObj;
        })
      );

      await sql`
      INSERT INTO recipes_products (recipe_id, product_id, amount)
      VALUES ${sql(productIDs.map((p) => [id, p.id, p.amount]))}
      `;
    }

    return updatedRecipe;
  });

  return updatedRecipe;
};

exports.deleteRecipe = async (id) => {
  await sql.begin(async () => {
    await sql`
    DELETE FROM recipes_products
    WHERE recipe_id = ${id}
    `;

    await sql`
    DELETE FROM recipes
    WHERE id = ${id}
    `;
  });
};

exports.getAllMacros = async (id) => {
  //macros recipe calculator

  const macros = await sql`
   SELECT 
   ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.calories), 0)::NUMERIC, 0) AS calories,
   ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.fats), 0)::NUMERIC, 1) AS fats,
   ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.carbohydrates), 0)::NUMERIC, 1) AS carbohydrates,
   ROUND(COALESCE(SUM((recipes_products.amount::NUMERIC / 100) * products.protein), 0)::NUMERIC, 1) AS proteins
   FROM recipes
   JOIN recipes_products ON recipes_products.recipe_id = recipes.id
   JOIN products ON products.id = recipes_products.product_id
   WHERE recipes.id = ${id};
   `;

  return macros;
};
