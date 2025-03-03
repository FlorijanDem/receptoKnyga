const { sql } = require("../dbConnection");

exports.registerUser = async (data) => {
  const [newUser] = await sql`
        INSERT INTO users ${sql(data.newUser, "username", "password", "email")}
        RETURNING users.*
    `;
  return newUser;
};

exports.getUserByUsername = async (username) => {
  const [user] = await sql`
        SELECT *
        FROM users
        WHERE username=${username}
    `;
  return user;
};

exports.getUserByEmail = async (email) => {
  const [user] = await sql`
        SELECT *
        FROM users
        WHERE email=${email}
    `;
  return user;
};