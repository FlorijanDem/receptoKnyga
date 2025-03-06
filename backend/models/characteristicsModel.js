const { sql } = require("../dbConnection");

exports.getCharacteristicsById = async (id) => {
  const [characteristic] = await sql`
        SELECT *
        FROM characteristics
        WHERE user_id=${id}
    `;
  return characteristic;
};

exports.updateCharacteristic = async (data, id) => {
  const [characteristic] = await sql`
        UPDATE characteristics
        SET ${sql(data)}
        WHERE user_id=${id}
        RETURNING characteristics.*`;
  return characteristic;
};
