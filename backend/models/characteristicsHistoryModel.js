// characteristicsHistoryModel.js
const { sql } = require("../dbConnection");

exports.getWeightHistoryByUserId = async (id) => {
  const history = await sql`
    SELECT id, weight, date
    FROM characteristics_history_weight
    WHERE user_id = ${id}
    ORDER BY date DESC
  `;
  return history;
};

exports.addWeightEntry = async (userId, weight, date) => {
  const [entry] = await sql`
    INSERT INTO characteristics_history_weight (user_id, weight, date)
    VALUES (${userId}, ${weight}, ${date ?? "NOW()"})
    ON CONFLICT (user_id, date) 
    DO UPDATE SET weight = EXCLUDED.weight
    RETURNING *
  `;
  return entry;
};

exports.updateWeightEntry = async (entryId, userId, weight, date) => {
  const [entry] = await sql`
    UPDATE characteristics_history_weight
    SET 
      weight = ${weight},
      date = ${date}
    WHERE id = ${entryId} AND user_id = ${userId}
    RETURNING *
  `;
  return entry;
};
