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

exports.getUserByid = async (id) => {
  const [user] = await sql`
        SELECT *
        FROM users
        WHERE id=${id}
    `;
  return user;
};

exports.updateUser = async (data, id) => {
  // console.log(data);

  const [user] = await sql`
        UPDATE users
        SET ${sql(data)}
        WHERE id=${id}
        RETURNING users.*
    `;
  return user;
};

exports.getAllUsers = async (query) => {
  console.log(query);

  const users = await sql`
        SELECT *
        FROM users
        WHERE 1=1
        ${query.banned === "true" ? sql`AND banned` : query.banned === "false" ? sql`AND NOT banned` : sql``}
    `;
  return users;
};
