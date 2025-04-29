const { sql } = require("../dbConnection");

exports.getAllLists = async (userId) => {
  const lists = await sql`
    SELECT 
      sl.*,
      json_agg(
        json_build_object(
          'id', sli.id,
          'name', sli.name,
          'is_checked', sli.is_checked,
          'created_at', sli.created_at,
          'updated_at', sli.updated_at
        )
      ) as items
    FROM shopping_lists sl
    LEFT JOIN shopping_list_items sli ON sl.id = sli.list_id
    WHERE sl.user_id = ${userId}
    GROUP BY sl.id
    ORDER BY sl.created_at DESC
  `;
  
  return lists.map(list => ({
    ...list,
    items: list.items[0] ? list.items : []
  }));
};

exports.getList = async (listId, userId) => {
  const list = await sql`
    SELECT 
      sl.*,
      json_agg(
        json_build_object(
          'id', sli.id,
          'name', sli.name,
          'is_checked', sli.is_checked,
          'created_at', sli.created_at,
          'updated_at', sli.updated_at
        )
      ) as items
    FROM shopping_lists sl
    LEFT JOIN shopping_list_items sli ON sl.id = sli.list_id
    WHERE sl.id = ${listId} AND sl.user_id = ${userId}
    GROUP BY sl.id
  `;

  if (!list.length) {
    throw new Error("List not found");
  }

  return {
    ...list[0],
    items: list[0].items[0] ? list[0].items : []
  };
};

exports.createList = async (userId, title) => {
  const [newList] = await sql`
    INSERT INTO shopping_lists (user_id, title)
    VALUES (${userId}, ${title})
    RETURNING *
  `;
  
  return newList;
};

exports.updateList = async (listId, userId, title) => {
  const [updatedList] = await sql`
    UPDATE shopping_lists
    SET title = ${title}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${listId} AND user_id = ${userId}
    RETURNING *
  `;

  if (!updatedList) {
    throw new Error("List not found");
  }

  return updatedList;
};

exports.deleteList = async (listId, userId) => {
  const [deletedList] = await sql`
    DELETE FROM shopping_lists
    WHERE id = ${listId} AND user_id = ${userId}
    RETURNING *
  `;

  if (!deletedList) {
    throw new Error("List not found");
  }

  return deletedList;
};

exports.addItem = async (listId, userId, name) => {
  const [list] = await sql`
    SELECT id FROM shopping_lists 
    WHERE id = ${listId} AND user_id = ${userId}
  `;

  if (!list) {
    throw new Error("List not found");
  }

  const [newItem] = await sql`
    INSERT INTO shopping_list_items (list_id, name)
    VALUES (${listId}, ${name})
    RETURNING *
  `;
  
  return newItem;
};

exports.updateItem = async (itemId, userId, data) => {
  const [item] = await sql`
    SELECT sli.* 
    FROM shopping_list_items sli
    JOIN shopping_lists sl ON sl.id = sli.list_id
    WHERE sli.id = ${itemId} AND sl.user_id = ${userId}
  `;

  if (!item) {
    throw new Error("Item not found");
  }

  let updateQuery = 'UPDATE shopping_list_items SET ';
  const values = [];
  const params = [];

  if (data.name !== undefined) {
    values.push('name = $' + (params.length + 1));
    params.push(data.name);
  }
  if (data.is_checked !== undefined) {
    values.push('is_checked = $' + (params.length + 1));
    params.push(data.is_checked);
  }

  if (values.length === 0) {
    throw new Error("No valid fields to update");
  }

  values.push('updated_at = CURRENT_TIMESTAMP');
  updateQuery += values.join(', ') + ' WHERE id = $' + (params.length + 1);
  params.push(itemId);

  const [updatedItem] = await sql.unsafe(updateQuery, params);
  return updatedItem;
};

exports.deleteItem = async (itemId, userId) => {
  const [item] = await sql`
    SELECT sli.* 
    FROM shopping_list_items sli
    JOIN shopping_lists sl ON sl.id = sli.list_id
    WHERE sli.id = ${itemId} AND sl.user_id = ${userId}
  `;

  if (!item) {
    throw new Error("Item not found");
  }

  await sql`
    DELETE FROM shopping_list_items
    WHERE id = ${itemId}
  `;

  return item;
}; 