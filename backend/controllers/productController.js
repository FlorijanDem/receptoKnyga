const { sql } = require("../dbConnection");

// Search products using pg_trgm for fuzzy matching
exports.searchProductsHandler = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Search query must be at least 2 characters long",
      });
    }

    // Using pg_trgm for fuzzy matching with similarity function
    const products = await sql`
      SELECT id, title
      FROM products
      WHERE similarity(title, ${query}) > 0.3 OR title ILIKE ${`%${query}%`}
      ORDER BY similarity(title, ${query}) DESC
      LIMIT 10
    `;

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
