const {
  getReviewsByRecipe,
  deleteReview,
  addReview,
  updateReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { protect, allowAccessTo } = require("../controllers/userController");
const {
  checkIfReviewed,
  checkReviewCreator,
} = require("../validators/checkReviewParams");
const { checkReviewsBody } = require("../validators/checkReviewBody");
const { checkReviewsQuery } = require("../validators/checkReviewQuery");
const validate = require("../validators/validate");

const reviewRouter = require("express").Router();

reviewRouter
  .route("/")
  .get(
    protect,
    allowAccessTo("admin"),
    checkReviewsQuery,
    validate,
    getAllReviews
  );

reviewRouter
  .route("/:recipe_id")
  .get(protect, checkReviewsQuery, validate, getReviewsByRecipe)
  .post(protect, checkIfReviewed, checkReviewsBody, validate, addReview);

// "/:recipe_id/:review_id"
reviewRouter
  .route("/:recipe_id/:review_id")
  .patch(protect, checkReviewCreator, checkReviewsBody, validate, updateReview)
  .delete(protect, checkReviewCreator, validate, deleteReview);

module.exports = reviewRouter;
