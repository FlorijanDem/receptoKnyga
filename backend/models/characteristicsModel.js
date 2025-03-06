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
  const user = await sql`
      SELECT *
      FROM characteristics
      WHERE user_id=${id}
  `;

  if (user.length === 0) {
    // Insert new characteristics if no existing record is found

    const [characteristics] = await sql`
        INSERT INTO characteristics (user_id, height, weight, age, gender)
        VALUES (${id}, ${data.height}, ${data.weight}, ${data.age}, ${data.gender})
        RETURNING characteristics.*
    `;
    return characteristics;
  } else {
    // Update existing characteristics
    const [characteristic] = await sql`
          UPDATE characteristics
          SET 
            height = ${data.height},
            weight = ${data.weight},
            age = ${data.age},
            gender = ${data.gender}
          WHERE user_id=${id}
          RETURNING *
    `;
    return characteristic;
  }
};
