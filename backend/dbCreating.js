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
            type VARCHAR(255),
            photo VARCHAR,
            -- Preperation time in minutes
            preperation_time INTEGER,
            servings INTEGER,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;

    // Create products table,
    // every product have own id who putted into "recipes.products" array
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            units_of_meassurement VARCHAR
        )
    `;

    // If I understand correctly, the amount inside can be anything
    await sql`
        CREATE TABLE IF NOT EXISTS recipes_products (
            id SERIAL PRIMARY KEY, 
            recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
            amount VARCHAR(255),
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;
  } catch (err) {
    console.error("Failed to create tables:", err);
  }
};

const dbSettings = async () => {
  try {
    const trgmCheck = await sql`
      SELECT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
      );
    `;
    
    if (!trgmCheck[0].exists) {
      await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
      console.log('pg_trgm plėtinys sėkmingai įdiegtas');
    }

    console.log('pg_trgm plėtinys sėkmingai įdiegtas ir aktyvuotas.');

    //  indeksai recipes products lentelei
    await sql`CREATE INDEX IF NOT EXISTS recipes_title_trgm_idx ON recipes USING gin (title gin_trgm_ops)`;
    await sql`CREATE INDEX IF NOT EXISTS recipes_description_trgm_idx ON recipes USING gin (description gin_trgm_ops)`;
    await sql`CREATE INDEX IF NOT EXISTS products_title_trgm_idx ON products USING gin (title gin_trgm_ops)`;

    
    await sql`ALTER TABLE recipes SET (autovacuum_enabled = true)`;
    await sql`ALTER TABLE recipes SET (autovacuum_analyze_scale_factor = 0.1)`;
    await sql`ALTER TABLE products SET (autovacuum_enabled = true)`;
    await sql`ALTER TABLE products SET (autovacuum_analyze_scale_factor = 0.1)`;

    console.log('Indeksai sukurti ir optimizacijos nustatymai pritaikyti sėkmingai.');
  } catch (err) {
    console.error('Klaida nustatant duomenų bazės parametrus:', err);
  }
};

module.exports = { createDBtables, dbSettings };
