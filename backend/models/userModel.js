const { sql } = require("../dbConnection");

exports.registerUser = async (user) => {
  const [newUser] = await sql`
        INSERT INTO users ${sql(user, "username", "password", "email")}
        RETURNING users.*
    `;
  return newUser;
};
