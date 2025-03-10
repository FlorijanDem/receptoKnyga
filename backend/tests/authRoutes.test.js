const request = require("supertest");
const express = require("express");
const authRouter = require("../routes/authRouter.js"); // Adjust path as needed
const app = express();

app.use(express.json()); // Middleware to parse JSON request body
app.use("/api/auth", authRouter); // Mount the router

describe("Auth Routes", () => {
  // Test user registration
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register") // Corrected path to match the mounted router
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "Test@1234"
      });

    console.log("Registration Response:", response.body); // Debugging

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  // Test login
  it("should log in an existing user", async () => {
    const response = await request(app)
      .post("/api/auth/login") // Path is correct
      .send({
        email: "test@example.com", // Make sure the email matches the registration
        password: "Test@1234",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  // Test fetching user details (protected route)
  it("should get user details if authenticated", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "Test@1234" });

    const token = loginRes.body.token;

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
  });

  // Test logout
  it("should log out the user", async () => {
    const response = await request(app).post("/api/auth/logout"); // Path is correct

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");
  });
});
