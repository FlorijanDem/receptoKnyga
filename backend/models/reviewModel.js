const { sql } = require("../dbConnection");

exports.getReviewsByRecipe = async (recipe_id) => {
  const reviews = await sql`     
  SELECT reviews.id, 
        reviews.recipe_id, 
        reviews.user_id, 
        reviews.rating, 
        reviews.review_text, 
        created_at,
        users.username
        FROM reviews
        LEFT JOIN users
        ON users.id = reviews.user_id
        WHERE reviews.recipe_id = ${recipe_id}
        ORDER BY created_at DESC
        `;
  return reviews;
};

exports.addReview = async (data) => {
  const checkReview = await sql`
  SELECT * FROM reviews 
  WHERE user_id = ${data.user_id} 
  AND recipe_id = ${data.recipe_id}`;

  if (checkReview.length > 0) {
    throw new Error("You have already reviewed this recipe.");
  }

  const [newReview] = await sql`
  INSERT INTO reviews (recipe_id, user_id, rating, review_text)
  VALUES (${data.recipe_id}, ${data.user_id}, ${data.rating}, ${data.review_text})
  RETURNING *`;

  return newReview;
};

exports.updateReview = async (user_id, data, review_id) => {
  const rating = Number(data.rating);
  const [existingReview] =
    await sql`SELECT user_id FROM reviews WHERE id = ${review_id}`;
  const [user] = await sql`SELECT role FROM users WHERE id = ${user_id}`;
  const isAdmin = user.role === "admin";

  if (!existingReview || (existingReview.user_id !== user_id && !isAdmin)) {
    throw new Error("Unauthorized");
  }

  const [review] = await sql`
    UPDATE reviews
    SET rating = ${rating}, review_text = ${data.review_text}, created_at = NOW()
    WHERE id = ${review_id} ${isAdmin ? sql`` : sql`AND user_id = ${user_id}`}
    RETURNING *, 
    (SELECT username FROM users WHERE users.id = reviews.user_id) AS username;;
  `;

  return review;
};

exports.deleteReview = async (id) => {
  const deletedReview = await sql`
    DELETE FROM reviews
    WHERE id = ${id}
    RETURNING *
    `;
  return deletedReview;
};
