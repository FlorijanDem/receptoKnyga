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
            email VARCHAR(255) UNIQUE NOT NULL,
            banned BOOLEAN DEFAULT FALSE
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
            date_of_birth DATE,
            gender VARCHAR(25),
            activity_level_id INTEGER REFERENCES activity_levels(id),
        )
    `;

    // Create characteristics_history_weight table
    await sql`
    CREATE TABLE IF NOT EXISTS characteristics_history_weight (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      weight FLOAT NOT NULL,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE(user_id, date) -- Prevents duplicate entries for same user on same date
    )
  `;

    // Create activity_levels table
    await sql`
  CREATE TABLE IF NOT EXISTS activity_levels (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL UNIQUE,
    multiplier FLOAT NOT NULL UNIQUE
  )
  `;

    // Insert default activity levels
    await sql`
    INSERT INTO activity_levels (label, description, multiplier)
    VALUES 
      ('Sedentary', 'Little or no exercise', 1.2),
      ('Light', 'Light exercise/sports 1-3 days/week', 1.375),  
      ('Moderate', 'Moderate exercise/sports 3-5 days/week', 1.55),
      ('Active', 'Hard exercise/sports 6-7 days a week', 1.725),
      ('Very Active', 'Very hard exercise/sports & physical job or 2x training per day', 1.9)
    ON CONFLICT (label) DO NOTHING
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
            preparation_time INTEGER,
            servings INTEGER,
            approved BOOLEAN DEFAULT FALSE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;

    // Create products table,
    // every product have own id who putted into "recipes.products" array
    await sql`
    CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    title TEXT,
    othername TEXT,
    category TEXT,
    potassium INTEGER,
    selenium DOUBLE PRECISION,
    sodium INTEGER,
    zinc DOUBLE PRECISION,
    calories INTEGER,
    carbohydrates DOUBLE PRECISION,
    fiber DOUBLE PRECISION,
    netcarbs DOUBLE PRECISION,
    fats DOUBLE PRECISION,
    saturated DOUBLE PRECISION,
    mufa DOUBLE PRECISION,
    pufa DOUBLE PRECISION,
    pufa_w6 DOUBLE PRECISION,
    pufa_w3 DOUBLE PRECISION,
    protein DOUBLE PRECISION,
    vit_a_rae INTEGER,
    vit_b1 DOUBLE PRECISION,
    vit_b2 DOUBLE PRECISION,
    vit_b3 DOUBLE PRECISION,
    vit_b5 DOUBLE PRECISION,
    vit_b6 DOUBLE PRECISION,
    vit_b9 INTEGER,
    vit_b12 DOUBLE PRECISION,
    vit_c DOUBLE PRECISION,
    vit_d DOUBLE PRECISION,
    vit_e DOUBLE PRECISION,
    vit_k DOUBLE PRECISION,
    choline DOUBLE PRECISION,
    betaine DOUBLE PRECISION,
    calcium INTEGER,
    copper DOUBLE PRECISION,
    fluoride DOUBLE PRECISION,
    iron DOUBLE PRECISION,
    magnesium INTEGER,
    manganese DOUBLE PRECISION,
    phoshorus INTEGER
);`;
    // If I understand correctly, the amount inside can be anything
    await sql`
        CREATE TABLE IF NOT EXISTS recipes_products (
            id SERIAL PRIMARY KEY, 
            recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
            amount VARCHAR(255),
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;

    // Reviews table
    await sql`
        CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        rating INTEGER NOT NULL,
        review_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved BOOLEAN DEFAULT FALSE,
        UNIQUE (recipe_id, user_id)
        )
        `;

    // Consumed table
    await sql`
    CREATE TABLE consumed (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    `;
  } catch (err) {
    console.error("Failed to create tables:", err);
  }
};

const dbSettings = async () => {
  // Aktyvuoja pg_trgm plėtinį postgreSQL duomenų bazėje, kurio pagrindu realizuota netiksli paieska pagal fragmentą
  try {
    const trgmCheck = await sql`
        SELECT EXISTS (
          SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
        );
      `;

    if (!trgmCheck[0].exists) {
      await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
      console.log("pg_trgm plėtinys sėkmingai įdiegtas");
    }

    console.log("pg_trgm plėtinys sėkmingai įdiegtas ir aktyvuotas.");

    //  indeksai recipes products lentelei
    await sql`CREATE INDEX IF NOT EXISTS recipes_title_trgm_idx ON recipes USING gin (title gin_trgm_ops)`;
    await sql`CREATE INDEX IF NOT EXISTS recipes_description_trgm_idx ON recipes USING gin (description gin_trgm_ops)`;
    await sql`CREATE INDEX IF NOT EXISTS products_title_trgm_idx ON products USING gin (title gin_trgm_ops)`;

    // await sql`ALTER TABLE recipes SET (autovacuum_enabled = true)`;
    // await sql`ALTER TABLE recipes SET (autovacuum_analyze_scale_factor = 0.1)`;
    // await sql`ALTER TABLE products SET (autovacuum_enabled = true)`;
    // await sql`ALTER TABLE products SET (autovacuum_analyze_scale_factor = 0.1)`;

    console.log(
      "Indeksai sukurti ir optimizacijos nustatymai pritaikyti sėkmingai."
    );
  } catch (err) {
    console.error("Klaida nustatant duomenų bazės parametrus:", err);
  }
};

module.exports = { createDBtables, dbSettings };
