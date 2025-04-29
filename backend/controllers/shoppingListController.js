const {
  getAllLists,
  getList,
  createList,
  updateList,
  deleteList,
  addItem,
  updateItem,
  deleteItem
} = require("../models/shoppingListModel");

exports.getAllLists = async (req, res, next) => {
  try {
    const lists = await getAllLists(req.user.id);
    res.json(lists);
  } catch (error) {
    next(error);
  }
};

exports.getList = async (req, res, next) => {
  try {
    const list = await getList(req.params.id, req.user.id);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

exports.createList = async (req, res, next) => {
  const { title } = req.body;
  
  try {
    const newList = await createList(req.user.id, title);
    res.status(201).json(newList);
  } catch (error) {
    next(error);
  }
};

exports.updateList = async (req, res, next) => {
  const { title } = req.body;
  
  try {
    const updatedList = await updateList(req.params.id, req.user.id, title);
    res.json(updatedList);
  } catch (error) {
    next(error);
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    await deleteList(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  const { name } = req.body;
  
  try {
    const newItem = await addItem(req.params.listId, req.user.id, name);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  const { name, is_checked } = req.body;
  
  try {
    const updatedItem = await updateItem(req.params.itemId, req.user.id, { name, is_checked });
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    await deleteItem(req.params.itemId, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
