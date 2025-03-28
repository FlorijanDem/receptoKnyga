
const { searchProducts } = require("../models/productModel");

exports.searchProductsHandler = async (req, res) => {
  try {
    const { q } = req.query;
    
    // Check if q parameter is provided
    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Search query parameter 'q' is required",
      });
    }
    
    const products = await searchProducts(q);

    return res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to search products",
    });
  }
};
