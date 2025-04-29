const { sql } = require("../dbConnection");

exports.getAllLists = async (req, res, next) => {
  try {
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
      WHERE sl.user_id = ${req.user.id}
      GROUP BY sl.id
      ORDER BY sl.created_at DESC
    `;
    
    const transformedLists = lists.map(list => ({
      ...list,
      items: list.items[0] ? list.items : []
    }));

    res.json(transformedLists);
  } catch (error) {
    next(error);
  }
};

exports.getList = async (req, res, next) => {
  try {
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
      WHERE sl.id = ${req.params.id} AND sl.user_id = ${req.user.id}
      GROUP BY sl.id
    `;

    if (!list.length) {
      return res.status(404).json({ error: "List not found" });
    }

    const transformedList = {
      ...list[0],
      items: list[0].items[0] ? list[0].items : []
    };

    res.json(transformedList);
  } catch (error) {
    next(error);
  }
};

exports.createList = async (req, res, next) => {
  const { title } = req.body;
  
  try {
    const newList = await sql`
      INSERT INTO shopping_lists (user_id, title)
      VALUES (${req.user.id}, ${title})
      RETURNING *
    `;
    
    res.status(201).json(newList[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateList = async (req, res, next) => {
  const { title } = req.body;
  
  try {
    const updatedList = await sql`
      UPDATE shopping_lists
      SET title = ${title}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
      RETURNING *
    `;

    if (!updatedList.length) {
      return res.status(404).json({ error: "List not found" });
    }

    res.json(updatedList[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    const deletedList = await sql`
      DELETE FROM shopping_lists
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
      RETURNING *
    `;

    if (!deletedList.length) {
      return res.status(404).json({ error: "List not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  const { name } = req.body;
  
  try {
    const list = await sql`
      SELECT id FROM shopping_lists 
      WHERE id = ${req.params.listId} AND user_id = ${req.user.id}
    `;

    if (!list.length) {
      return res.status(404).json({ error: "List not found" });
    }

    const newItem = await sql`
      INSERT INTO shopping_list_items (list_id, name)
      VALUES (${req.params.listId}, ${name})
      RETURNING *
    `;
    
    res.status(201).json(newItem[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  const { name, is_checked } = req.body;
  
  try {
    const item = await sql`
      SELECT sli.* 
      FROM shopping_list_items sli
      JOIN shopping_lists sl ON sl.id = sli.list_id
      WHERE sli.id = ${req.params.itemId} AND sl.user_id = ${req.user.id}
    `;

    if (!item.length) {
      return res.status(404).json({ error: "Item not found" });
    }

    let updateQuery = 'UPDATE shopping_list_items SET ';
    const values = [];
    const params = [];

    if (name !== undefined) {
      values.push('name = $' + (params.length + 1));
      params.push(name);
    }
    if (is_checked !== undefined) {
      values.push('is_checked = $' + (params.length + 1));
      params.push(is_checked);
    }

    if (values.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    values.push('updated_at = CURRENT_TIMESTAMP');
    updateQuery += values.join(', ') + ' WHERE id = $' + (params.length + 1);
    params.push(req.params.itemId);

    const updatedItem = await sql.unsafe(updateQuery, params);
    res.json(updatedItem[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await sql`
      SELECT sli.* 
      FROM shopping_list_items sli
      JOIN shopping_lists sl ON sl.id = sli.list_id
      WHERE sli.id = ${req.params.itemId} AND sl.user_id = ${req.user.id}
    `;

    if (!item.length) {
      return res.status(404).json({ error: "Item not found" });
    }

    await sql`
      DELETE FROM shopping_list_items
      WHERE id = ${req.params.itemId}
    `;

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
