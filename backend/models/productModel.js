const { sql } = require("../dbConnection");

/**
 * Search for products based on query string
 * @param {string} q - The search query
 * @returns {Promise<Array>} - Array of matching products
 */
exports.searchProducts = async (q) => {
  try {
    // Ensure q is a string
    const searchQuery = String(q || '');
    
    // Using pg_trgm for fuzzy matching with similarity function
    const products = await sql`
      SELECT id, title, category
      FROM products
      WHERE similarity(title, ${searchQuery}) > 0.3 OR title ILIKE ${`%${searchQuery}%`}
      ORDER BY similarity(title, ${searchQuery}) DESC
      LIMIT 10
    `;
    
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
