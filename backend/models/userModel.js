const { sql } = require("../dbConnection");

exports.registerUser = async (data) => {
  const [newUser] = await sql`
        INSERT INTO users ${sql(data.newUser, "username", "password", "email")}
        RETURNING users.*
    `;
  return newUser;
};
