const shoppingListRouter = require("express").Router();
const { 
  getAllLists,
  getList,
  createList,
  updateList,
  deleteList,
  addItem,
  updateItem,
  deleteItem
} = require("../controllers/shoppingListController");
const { protect } = require("../controllers/userController");

// Shopping Lists routes
shoppingListRouter
  .route("/")
  .get(protect, getAllLists)
  .post(protect, createList);

shoppingListRouter
  .route("/:id")
  .get(protect, getList)
  .patch(protect, updateList)
  .delete(protect, deleteList);

// Shopping List Items routes
shoppingListRouter
.post("/:listId/items", protect, addItem);
shoppingListRouter
  .route("/items/:itemId")
  .patch(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = shoppingListRouter; 