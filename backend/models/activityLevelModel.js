const { sql } = require("../dbConnection");

exports.getAllActivityLevels = async () => {
  const activityLevels = await sql`
        SELECT *
        FROM activity_levels
    `;
  return activityLevels;
};
