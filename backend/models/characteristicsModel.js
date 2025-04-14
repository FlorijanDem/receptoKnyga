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
        INSERT INTO characteristics (user_id, height, weight, age, date_of_birth, gender, activity_level_id)
        VALUES (${id}, ${data.height ?? null}, ${data.weight ?? null}, ${data.age ?? null}, ${data.date_of_birth ?? null}, ${data.gender ?? null}, ${data.activity_level_id ?? null})
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
            date_of_birth = ${data.date_of_birth ?? user.date_of_birth ?? null},
            gender = ${data.gender ?? user.gender ?? null},
            activity_level_id = ${data.activity_level_id ?? user.activity_level_id ?? null}

          WHERE user_id=${id}
          RETURNING *
    `;
    return characteristic;
  }
};
