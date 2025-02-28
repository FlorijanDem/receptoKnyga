const { sql } = require("./dbConnection");

const createDBtables = async () => {
  try {
    // This is SQL query disable notices
    // (like table already exists) inside createDBtables function
    await sql`
          SET client_min_messages TO WARNING;
      `;

    // Create users table if not exists
    // Role do not must be so long
    // Can not say anything about username and email long so 255
    await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            role VARCHAR(10) NOT NULL DEFAULT 'user',
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL
    );`;

    // Create characteristics table who refences to user id
    // Some characteristics can be optionall,
    // no information about this point in jira task
    await sql`
        CREATE TABLE IF NOT EXISTS characteristics (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            height FLOAT,
            weight FLOAT,
            age INTEGER,
            gender VARCHAR(25)
        )
    `;

    // Create recipes table
    // The "type" field represents the recipe category, such as "Vegetarian" or "Vegan".
    // If no category it remains NULL.
    await sql`
        CREATE TABLE IF NOT EXISTS recipes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            method TEXT NOT NULL,
            type VARCHAR(255)
        )
    `;

    // Create products table,
    // every product have own id who putted into "recipes.products" array
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL
        )
    `;

    // If I understand correctly, the amount inside can be anything
    await sql`
        CREATE TABLE IF NOT EXISTS recipes_products (
            id SERIAL PRIMARY KEY, 
            recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
            amount VARCHAR(255),
            product INTEGER REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;
  } catch (err) {
    console.error("Failed to create tables:", err);
  }
};

module.exports = { createDBtables };
