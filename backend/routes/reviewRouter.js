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
  .get(checkReviewsQuery, validate, getReviewsByRecipe)
  .post(checkIfReviewed, protect, checkReviewsBody, addReview);

// "/:recipe_id/:review_id"
reviewRouter
  .route("/:recipe_id/:id")
  .patch(protect, checkReviewCreator, checkReviewsBody, updateReview)
  .delete(protect, validate, checkReviewCreator, deleteReview);

module.exports = reviewRouter;
