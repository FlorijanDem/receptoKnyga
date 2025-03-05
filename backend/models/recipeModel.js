const { sql } = require("../dbConnection");

// Does not work without DB

exports.getAllRecipes = async (filter) => {
  const { limit, offset, sortBy, order, searchString } = filter;

  // Needs more work on filtering
  const recipes = await sql`
    SELECT recipes.*
    FROM recipes
    LEFT JOIN recipes_products
    ON recipes.id = recipes_products.recipe_id
    LEFT JOIN products
    ON recipes_products.product_id = products.id
    ${searchString ? sql`WHERE ${searchString}` : sql``}
    GROUP BY recipes.id
    ORDER BY ${sortBy} ${sql.unsafe(order)}
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  return recipes;
};

exports.getRecipesCount = async (filter) => {
  const { searchString } = filter;

  // Needs more work on filtering
  const [recipesCount] = await sql`
    SELECT COUNT(recipes.id)
    FROM recipes
    LEFT JOIN recipes_products
    ON recipes.id = recipes_products.recipe_id
    LEFT JOIN products
    ON recipes_products.product_id = products.id
    ${searchString ? sql`WHERE ${searchString}` : sql``}
    `;

  console.log(recipesCount);

  return recipesCount?.count;
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
          [productID] = await sql`
           INSERT INTO products ${sql(product)}

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
           INSERT INTO products ${sql(product)}

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
