import React, { useContext } from "react";
import { FormProvider } from "react-hook-form";
import FormField from "../FormField";
import IngredientField from "../IngredientField";
import {
  RECIPE_LABELS,
  RECIPE_TYPES,
  RECIPE_VALIDATION,
} from "../../utils/validation/recipeValidation";
import UserContext from "../../contexts/UserContext";

/**
 * Komponentas, atsakingas už receptų formos dizainą ir struktūrą
 *
 * @param {Object} props - Komponento savybės
 * @param {Object} props.methods - React Hook Form metodai
 * @param {Function} props.onSubmit - Funkcija, kviečiama pateikiant formą
 * @param {string|null} props.error - Klaidos pranešimas (jei yra)
 * @param {Object} props.searchResults - Paieškos rezultatai
 * @param {number} props.activeIndex - Aktyvaus paieškos rezultato indeksas
 * @param {Function} props.handleProductSearch - Funkcija produktų paieškai
 * @param {Function} props.handleKeyDown - Funkcija klaviatūros įvykiams apdoroti
 * @param {boolean} props.isSearching - Ar vyksta paieška
 * @param {Function} props.selectProduct - Funkcija produktui pasirinkti
 * @param {Function} props.setActiveIndex - Funkcija aktyviam indeksui nustatyti
 * @param {Function} props.addProductField - Funkcija naujam produkto laukui pridėti
 * @param {Function} props.remove - Funkcija produkto laukui pašalinti
 * @param {Object[]} props.fields - Ingredientų laukų masyvas
 */
const RecipeFormLayout = ({
  methods,
  onSubmit,
  error,
  searchResults,
  activeIndex,
  handleProductSearch,
  handleKeyDown,
  isSearching,
  selectProduct,
  setActiveIndex,
  addProductField,
  remove,
  fields,
  action,
}) => {
  const { user } = useContext(UserContext);
  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
        {action === "edit" ? "Edit" : "Add"} Recipe
      </h2>

      {error &&
        error.split("; ").map((errStr, i) => (
          <p key={i} className="text-red-500 text-center">
            {errStr}
          </p>
        ))}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="title"
            label={RECIPE_LABELS.title}
            validation={RECIPE_VALIDATION.title}
          />

          <FormField
            name="description"
            label={RECIPE_LABELS.description}
            type="textarea"
            rows={3}
            validation={RECIPE_VALIDATION.description}
          />

          <FormField
            name="method"
            label={RECIPE_LABELS.method}
            type="textarea"
            rows={4}
            validation={RECIPE_VALIDATION.method}
          />

          <div className="flex space-x-4">
            <div className="w-1/2">
              <FormField
                name="preparation_time"
                label={RECIPE_LABELS.preparation_time}
                type="number"
                validation={RECIPE_VALIDATION.preparation_time}
              />
            </div>
            <div className="w-1/2">
              <FormField
                name="servings"
                label={RECIPE_LABELS.servings}
                type="number"
                validation={RECIPE_VALIDATION.servings}
              />
            </div>
          </div>

          <FormField name="type" label={RECIPE_LABELS.type} type="select">
            {RECIPE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </FormField>

          <FormField
            name="photo"
            label={RECIPE_LABELS.photo}
            validation={RECIPE_VALIDATION.photo}
          />

          <div>
            <p className="text-gray-600">Ingredients</p>
            <fieldset className="border p-4 rounded mt-1">
              {methods.formState.errors.products && (
                <p className="text-red-500 text-sm mb-2">
                  Please check all ingredient fields
                </p>
              )}

              {fields.map((field, index) => (
                <IngredientField
                  key={field.id}
                  index={index}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                  handleProductSearch={(e) => handleProductSearch(e, index)}
                  handleKeyDown={(e) => handleKeyDown(e, index)}
                  searchResults={searchResults}
                  activeIndex={activeIndex}
                  selectProduct={selectProduct}
                  isSearching={isSearching}
                  setActiveIndex={setActiveIndex}
                />
              ))}

              <button
                type="button"
                className="text-[var(--color-recipe-primary)] text-sm"
                onClick={addProductField}
              >
                + Add Ingredient
              </button>
            </fieldset>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-recipe-primary)] text-white p-2 rounded"
            disabled={user?.banned}
          >
            {action === "edit" ? "Edit" : "Add"} Recipe
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default RecipeFormLayout;
