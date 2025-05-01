const productRouter = require("express").Router();
const { searchProductsHandler } = require("../controllers/productController");
const { checkProductSearchQuery } = require("../validators/productValidation");
const validate = require("../validators/validate");
const { protect } = require("../controllers/userController");

// Route for searching products - now requires authentication and uses /?q= endpoint
productRouter.get("/", protect, checkProductSearchQuery, validate, searchProductsHandler);

module.exports = productRouter;
