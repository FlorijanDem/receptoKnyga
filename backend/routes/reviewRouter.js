const {
  getReviewsByRecipe,
  deleteReview,
  addReview,
  updateReview,
} = require("../controllers/reviewController");
const { protect } = require("../controllers/userController");
const { checkReviewsParams } = require("../validators/checkReviewParams");
const { checkReviewsBody } = require("../validators/checkReviewBody");
const { checkReviewsQuery } = require("../validators/checkReviewQuery");

const reviewRouter = require("express").Router();

reviewRouter
  .route("/:recipe_id")
  .get(checkReviewsQuery, getReviewsByRecipe)
  .post(protect, checkReviewsBody, addReview);


reviewRouter
  .route("/:recipe_id/:id")
  .patch(protect, checkReviewsParams, checkReviewsBody, updateReview)
  .delete(protect, checkReviewsParams, deleteReview);

module.exports = reviewRouter;
