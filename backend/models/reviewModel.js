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
  // console.log(data);
  data.approved =
    data.approved === "true"
      ? true
      : data.approved === "false"
        ? false
        : data.approved;

  // const rating = Number(data.rating);
  const [review] = await sql`
    UPDATE reviews
    SET 
    ${sql(data, "rating", "review_text", "approved")}

    ${Object.keys(data).includes("approved") ? sql`` : sql`created_at = now()`}
    WHERE id = ${review_id} 
    
    RETURNING *, 
    (SELECT username FROM users WHERE users.id = reviews.user_id) AS username;
  `;
  // AND user_id = ${user_id}

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

exports.getAllReviews = async (query) => {
  const reviews = await sql`
  SELECT reviews.id, 
        reviews.recipe_id, 
        reviews.user_id, 
        reviews.rating, 
        reviews.review_text, 
        reviews.created_at,
        reviews.approved,
        users.username
        FROM reviews
        LEFT JOIN users
        ON users.id = reviews.user_id
        WHERE 1=1
        ${query.approved === "true" ? sql`AND approved` : query.approved === "false" ? sql`AND NOT approved` : sql``}
        ORDER BY created_at DESC
        LIMIT ${query.limit}
        OFFSET ${(query.page - 1) * query.limit}
        `;
  return reviews;
};

exports.countReviews = async (query) => {
  const [{ count }] = await sql`
  SELECT COUNT(reviews.id)
  FROM reviews
  WHERE 1=1
  ${query.approved === "true" ? sql`AND approved` : query.approved === "false" ? sql`AND NOT approved` : sql``}
  `;
  return count;
};
