const { param } = require("express-validator");
const { getReviewById } = require("../models/reviewModel");
const { getUserById } = require("../models/userModel");

exports.checkIfReviewed = [
  param("recipe_id").custom(async (recipe_id, { req }) => {
    try {
      const existingReview = await getReviewById(recipe_id, req.user?.id);
      if (existingReview) {
        throw new Error("You have already reviewed this recipe");
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }),
];

exports.checkReviewCreator = [
  param("review_id").custom(async (review_id, { req }) => {
    try {
      const review = await getReviewById(review_id);
      if (!review) {
        throw new Error("Review not found");
      }
      const user = await getUserById(req.user?.id);
      if (user.role === "admin") {
        return true;
      }
      if (review.user_id !== req.user?.id) {
        throw new Error("You can't edit or delete others reviews");
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }),
];
