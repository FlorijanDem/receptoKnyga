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
  // Check if the user characteristics exist
  const existingUser = await sql`
      SELECT *
      FROM characteristics
      WHERE user_id=${id}
  `;

  if (existingUser.length === 0) {
    // Insert new characteristics if no existing record is found

    const [characteristics] = await sql`
        INSERT INTO characteristics (user_id, height, weight, age, gender)
        VALUES (${id}, ${data.height ?? null}, ${data.weight ?? null}, ${data.age ?? null}, ${data.gender ?? null})
        RETURNING characteristics.*
    `;
    return characteristics;
  } else {
    const user = existingUser[0];
    // Update existing characteristics
    const [characteristic] = await sql`
          UPDATE characteristics
          SET 
            height = ${data.height ?? user.height ?? null},
            weight = ${data.weight ?? user.weight ?? null},
            age = ${data.age ?? user.age ?? null},
            gender = ${data.gender ?? user.gender ?? null}
          WHERE user_id=${id}
          RETURNING *
    `;
    return characteristic;
  }
};
