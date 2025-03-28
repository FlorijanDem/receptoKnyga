const {
  getReviewsByRecipe,
  deleteReview,
  addReview,
  updateReview,
} = require("../models/reviewModel");

exports.getReviewsByRecipe = async (req, res, next) => {
  try {
    const { page, limit, sortBy, order } = req.query;
    const result = await getReviewsByRecipe(
      req.params.recipe_id,
      page,
      limit,
      sortBy,
      order
    );
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const newReview = await addReview({
      ...req.body,
      recipe_id: req.params.recipe_id,
      user_id: req.user.id,
    });
    return res.status(201).json({
      status: "success",
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { rating, review_text } = req.body;
    const updatedReview = await updateReview(
      req.user.id,
      { rating, review_text },
      req.params.review_id
    );
    return res.status(200).json({
      status: "success",
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const deletedReview = await deleteReview(req.params.review_id, req.user.role !== "admin" ? req.user.id : null);
    return res.status(200).json({
      status: "success",
      data: deletedReview,
    });
  } catch (error) {
    next(error);
  }
};
