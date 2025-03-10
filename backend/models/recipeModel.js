const { sql } = require("../dbConnection");

// Does not work without DB

exports.searchRecipes = async (filters) => {
  const {
    q, // bendras paieškos tekstas
    type, // recepto tipas
    preparation_time, // paruošimo laikas
    servings, // porcijų skaičius
    limit = 12,
    offset = 0,
  } = filters;

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
                JOIN products p ON p.id = rp.product_id
                WHERE rp.recipe_id = r.id
              ), 0)
            )
          ELSE 1.0
        END as similarity_score
      FROM recipes r
      WHERE 1=1
      ${type ? sql`AND r.type = ${type}` : sql``}
      ${preparation_time ? sql`AND r.preparation_time = ${preparation_time}` : sql``}
      ${servings ? sql`AND r.servings = ${servings}` : sql``}
      ${
        q
          ? sql`
        AND (
          similarity(r.title, ${q}) > 0.1
          OR r.title ILIKE ${`%${q}%`}
          OR similarity(r.description, ${q}) > 0.1
          OR r.description ILIKE ${`%${q}%`}
          OR EXISTS (
            SELECT 1 
            FROM recipes_products rp
            JOIN products p ON p.id = rp.product_id
            WHERE rp.recipe_id = r.id
            AND (
              similarity(p.title, ${q}) > 0.1
              OR p.title ILIKE ${`%${q}%`}
            )
          )
        )
      `
          : sql``
      }
    )
    SELECT * FROM recipe_scores
    ORDER BY 
      CASE WHEN ${!!q} THEN similarity_score ELSE 0 END DESC,
      title ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const countQuery = sql`
    SELECT COUNT(*) as total 
    FROM recipes r
    WHERE 1=1
    ${type ? sql`AND r.type = ${type}` : sql``}
    ${preparation_time ? sql`AND r.preparation_time = ${preparation_time}` : sql``}
    ${servings ? sql`AND r.servings = ${servings}` : sql``}
    ${
      q
        ? sql`
      AND (
        similarity(r.title, ${q}) > 0.1
        OR r.title ILIKE ${`%${q}%`}
        OR similarity(r.description, ${q}) > 0.1
        OR r.description ILIKE ${`%${q}%`}
        OR EXISTS (
          SELECT 1 
          FROM recipes_products rp
          JOIN products p ON p.id = rp.product_id
          WHERE rp.recipe_id = r.id
          AND (
            similarity(p.title, ${q}) > 0.1
            OR p.title ILIKE ${`%${q}%`}
          )
        )
      )
    `
        : sql``
    }
  `;
  // patikrinti ar nesukeicia reiksmes vietomis
  const [recipes, [{ total }]] = await Promise.all([searchQuery, countQuery]);

  return {
    recipes,
    total: parseInt(total),
  };
};

exports.getRecipeById = async (id) => {
  // Needs refinment when DB is ready
  const recipe = await sql.begin(async () => {
    const [recipe] = await sql`
    SELECT *
    FROM recipes
    WHERE id = ${id}
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
          SELECT products.title, products.units_of_meassurement, recipes_products.amount
          FROM products
          JOIN recipes_products
          ON products.id = recipes_products.product_id
          WHERE products.id = ${product_id}
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
  const newRecipe = await sql.begin(async () => {
    const [newRecipe] = await sql`
    INSERT INTO recipes ("title","photo","method","type","preparation_time","servings", "description", "user_id")
    VALUES (${recipe.title}, ${recipe.photo}, ${recipe.method}, ${recipe.type}, ${recipe.preparation_time}, ${recipe.servings}, ${recipe.description}, ${recipe.user_id})

    RETURNING *
    `;

    const productIDs = await Promise.all(
      recipe.products.map(async (product) => {
        let [productID] = await sql`
        SELECT id
        FROM products
        WHERE title = ${product.title}
        `;

        if (!productID) {
          // Need to fix products table
          [productID] = await sql`
           INSERT INTO products ${sql(product, "title", "units_of_meassurement")}

           RETURNING id
          `;
        }

        const productObj = { id: productID.id, amount: product.amount };

        return productObj;
      })
    );

    await Promise.all(
      productIDs.map(async (productID) => {
        await sql`
        INSERT INTO recipes_products (recipe_id, product_id, amount)
        VALUES (${newRecipe.id}, ${productID?.id}, ${productID?.amount})
        `;
      })
    );

    return newRecipe;
  });

  return newRecipe;
};

exports.updateRecipe = async (id, data) => {
  const columns = Object.keys(data).filter((key) => key !== "products");

  //   Needs testing when DB is ready
  const updatedRecipe = await sql.begin(async () => {
    const [updatedRecipe] = await sql`
    UPDATE recipes
    SET ${sql(data, columns)}
    WHERE id = ${id}
    RETURNING *
    `;

    if (data.products?.length > 0) {
      const productIDs = await Promise.all(
        data.products?.map(async (product) => {
          let [productID] = await sql`
        SELECT id
        FROM products
        WHERE title = ${product.title}
        `;

          if (!productID) {
            [productID] = await sql`
           INSERT INTO products ${sql(product, "title", "units_of_meassurement")}

           RETURNING id
          `;
          }

          const productObj = { id: productID.id, amount: product.amount };

          return productObj;
        })
      );

      await Promise.all(
        productIDs?.map(async (productID) => {
          await sql.begin(async () => {
            await sql`
            DELETE FROM recipes_products
            WHERE recipe_id = ${updatedRecipe.id}
            `;

            await sql`
            INSERT INTO recipes_products (recipe_id, product_id, amount)
            VALUES (${updatedRecipe.id}, ${productID?.id}, ${productID?.amount})
            `;
          });
        })
      );
    }

    return updatedRecipe;
  });

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

// Function to search recipes : title, description.
