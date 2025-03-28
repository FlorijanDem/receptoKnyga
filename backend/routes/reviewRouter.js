const {
  getReviewsByRecipe,
  deleteReview,
  addReview,
  updateReview,
} = require("../controllers/reviewController");
const { protect } = require("../controllers/userController");
const {
  checkIfReviewed,
  checkReviewCreator,
} = require("../validators/checkReviewParams");
const { checkReviewsBody } = require("../validators/checkReviewBody");
const { checkReviewsQuery } = require("../validators/checkReviewQuery");
const validate = require("../validators/validate");

const reviewRouter = require("express").Router();

reviewRouter
  .route("/:recipe_id")
  .get(protect, checkReviewsQuery, validate, getReviewsByRecipe)
  .post(protect, checkIfReviewed, checkReviewsBody, validate, addReview);

// "/:recipe_id/:review_id"
reviewRouter
  .route("/:recipe_id/:id")
  .patch(protect, checkReviewCreator, checkReviewsBody, validate, updateReview)
  .delete(protect, checkReviewCreator, validate, deleteReview);

module.exports = reviewRouter;