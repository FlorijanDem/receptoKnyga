const { sql } = require("../dbConnection");

exports.getCharacteristics = async () => {
  const [characteristics] = await sql`
        SELECT *
        FROM characteristics
    `;
  return characteristics;
};

exports.getCharacteristicsById = async (id) => {
  const [characteristic] = await sql`
        SELECT *
        FROM characteristics
        WHERE user_id=${id}
    `;
  return characteristic;
};

exports.postCharacteristic = async (data) => {
  const [characteristic] = await sql`
        INSERT INTO characteristics ${sql(data, ["user_id", "height", "weight", "age", "gender"])} 
        RETURNING characteristics.*`;
  return characteristic[0];
};

exports.updateCharacteristic = async (data, id) => {
  const [characteristic] = await sql`
        UPDATE characteristics
        SET ${sql(data, ["height", "weight", "age", "gender"])}
        WHERE user_id=${id}
        RETURNING characteristics.*`;
  return characteristic;
};

exports.deleteCharacteristic = async (id) => {
  const [characteristic] = await sql`
        DELETE FROM characteristics
        WHERE user_id=${id}
        RETURNING characteristics.*`;
  return characteristic;
};