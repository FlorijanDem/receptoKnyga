const { sql } = require("./dbTest.js");
const createDBtables = require("../dbCreating.js");

describe("Database Connection", () => {
  test("Should connect to PostgreSQL and fetch current time", async () => {
    const result = await sql`SELECT NOW()`;
    expect(result).toBeDefined();
  });
});
describe("Tables creation", () => {
  test("Should create tables", async () => {
    createDBtables;
  });
});
