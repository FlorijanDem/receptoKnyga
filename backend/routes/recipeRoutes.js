const {
  getAllRecipesHandler,
  getRecipeByIdHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
  getRecipeStats,
  addRecipe // ← ČIA turi būti pridėta naujai, jei naudoji šią funkciją
} = require("../controllers/recipeController");

const checkBanned = require('../middleware/checkBanned'); // jei eksportuota su module.exports

const { protect, allowAccessTo } = require("../controllers/userController");
const {
  checkCreateRecipesBody,
  checkUpdateRecipesBody,
} = require("../validators/checkRecipesBody");
const {
  checkRecipeParams,
  checkRecipeCreator,
} = require("../validators/checkRecipesParams");
const { checkRecipeQuery } = require("../validators/checkRecipesQuery");
const validate = require("../validators/validate");

recipeRouter
  .route("/")
  .get(checkRecipeQuery, validate, getAllRecipesHandler)
  .post(protect, checkCreateRecipesBody, validate, createRecipeHandler);

recipeRouter
  .route("/stats")
  .get(protect, allowAccessTo("admin"), getRecipeStats);

recipeRouter
  .route("/:id")
  .all(protect, checkRecipeParams, validate)
  .get(getRecipeByIdHandler)
  .patch(
    checkRecipeCreator,
    checkUpdateRecipesBody,
    validate,
    updateRecipeHandler
  )
  .delete(checkRecipeCreator, validate, deleteRecipeHandler);

  const express = require('express');
  const { addRecipe, getRecipes } = require('../controllers/recipeController');  // Importuojame kontrolerius
  const { checkBanned } = require('../middleware/checkBanned');  // Jei naudojate middleware užblokuotiems vartotojams
  const router = express.Router();
  // Pateikti POST užklausą receptui pridėti
  router.post('/', checkBanned, addRecipe);  // checkBanned - middleware, addRecipe - funkcija

  
  // Pateikti visus receptus
  router.get('/', getRecipes);
  
  // Pridėti receptą (tik jei vartotojas nėra užblokuotas)
  router.post('/', checkBanned, addRecipe);  // Užblokuotam vartotojui neleisti pridėti recepto
  
  module.exports = router;

// Pateikti visus receptus
router.get('/', getRecipes);

// Pridėti naują receptą (tik leidžiant ne užblokuotiems vartotojams)
router.post('/', checkBanned, addRecipe);  // Čia naudojame checkBanned middleware prieš pridedant receptą

module.exports = router;

// Pridėti receptą
router.post('/', addRecipe); // Pirmas parametras yra kelias, antras – funkcija


// Gauti visus receptus (nereikia checkBanned, nes tai ne veiksmas)
recipeRouter
  .route("/")
  .get(checkRecipeQuery, validate, getAllRecipesHandler)
  // Pridedame checkBanned, kad užblokuoti naudotojai negalėtų pridėti receptų
  .post(protect, checkBanned, checkCreateRecipesBody, validate, createRecipeHandler);

// Receptų statistika (admin funkcija)
recipeRouter
  .route("/stats")
  .get(protect, allowAccessTo("admin"), getRecipeStats);

// Veiksmai su receptais (pagal ID)
recipeRouter
  .route("/:id")
  .all(protect, checkRecipeParams, validate)
  .get(getRecipeByIdHandler)
  // Pridedame checkBanned, kad užblokuoti naudotojai negalėtų redaguoti receptų
  .patch(checkBanned, checkRecipeCreator, checkUpdateRecipesBody, validate, updateRecipeHandler)
  // Pridedame checkBanned, kad užblokuoti naudotojai negalėtų ištrinti receptų
  .delete(checkBanned, checkRecipeCreator, validate, deleteRecipeHandler);

module.exports = recipeRouter;


