const { sql } = require("../dbConnection");

exports.getReviewsByRecipe = async (recipe_id) => {
  const reviews = await sql`     
  SELECT reviews.id, 
        reviews.recipe_id, 
        reviews.user_id, 
        reviews.rating, 
        reviews.review_text, 
        reviews.created_at,
        users.username
        FROM reviews
        LEFT JOIN users
        ON users.id = reviews.user_id
        WHERE reviews.recipe_id = ${recipe_id}
        ORDER BY created_at DESC
        `;
  return reviews;
};

exports.getReviewById = async (id) => {
  const [review] = await sql`     
  SELECT reviews.*
  FROM reviews
  WHERE reviews.id = ${id}
  `;
  return review;
};

exports.addReview = async (data) => {
  const [newReview] = await sql`
  INSERT INTO reviews (recipe_id, user_id, rating, review_text)
  VALUES (${data.recipe_id}, ${data.user_id}, ${data.rating}, ${data.review_text})
  RETURNING *`;

  return newReview;
};

exports.updateReview = async (user_id, data, review_id) => {
  const rating = Number(data.rating);
  const [review] = await sql`
    UPDATE reviews
    SET rating = ${rating}, 
    review_text = ${data.review_text}, 
    created_at = NOW()
    WHERE id = ${review_id} 
    AND user_id = ${user_id}
    RETURNING *, 
    (SELECT username FROM users WHERE users.id = reviews.user_id) AS username;
  `;

  return review;
};

exports.deleteReview = async (id, user_id = null) => {
  const [deletedReview] = await sql`
    DELETE FROM reviews
    WHERE id = ${id}
    ${user_id ? sql`AND user_id = ${user_id}` : sql``}
    RETURNING *
    `;
  return deletedReview;
};
