const productRouter = require("express").Router();
const { searchProductsHandler } = require("../controllers/productController");
const { checkProductSearchQuery } = require("../validators/productValidation");
const validate = require("../validators/validate");

// Route for searching products
productRouter.get("/search", checkProductSearchQuery, validate, searchProductsHandler);

module.exports = productRouter;
