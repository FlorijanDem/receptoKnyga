import React, { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { INGREDIENT_VALIDATION } from "../utils/validation/recipeValidation";

/**
 * Ingredient input field component
 *
 * @param {Object} props - Component properties
 * @param {number} props.index - Ingredient index in array
 * @param {function} props.onRemove - Function to remove ingredient
 * @param {boolean} props.canRemove - Whether the ingredient can be removed
 * @param {function} props.handleProductSearch - Product search function
 * @param {function} props.handleKeyDown - Key press handling function
 * @param {Object} props.searchResults - Search results
 * @param {number} props.activeIndex - Active result index
 * @param {function} props.selectProduct - Product selection function
 * @param {boolean} props.isSearching - Whether search is in progress
 * @param {string} props.recipeType - Recipe type (veg/non-veg)
 * @param {function} props.setActiveIndex - Function to set active index
 * @returns {JSX.Element} Ingredient input component
 */
const IngredientField = ({
  index,
  onRemove,
  canRemove,
  handleProductSearch,
  handleKeyDown,
  searchResults,
  activeIndex,
  selectProduct,
  isSearching,
  recipeType,
  setActiveIndex,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const dropdownRef = useRef(null);
  const isCurrentSearchTarget = searchResults?.index === index;
  const hasSearchResults =
    searchResults.data &&
    searchResults.data.length > 0 &&
    isCurrentSearchTarget;

  // Automatinis skrolinimas, kai atsiranda paieškos rezultatai
  useEffect(() => {
    if (hasSearchResults && dropdownRef.current) {
      dropdownRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [hasSearchResults]);

  return (
    <div className="flex space-x-2 mb-2">
      <div
        className="w-3/5 relative"
        ref={isCurrentSearchTarget ? dropdownRef : null}
      >
        <input
          type="text"
          placeholder="Ingredient Name"
          className={`w-full p-2 border rounded ${
            errors.products?.[index]?.title ? "border-red-500" : ""
          }`}
          {...register(`products.${index}.title`, INGREDIENT_VALIDATION.title)}
          onChange={(e) => handleProductSearch(e, index, recipeType)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
        {isCurrentSearchTarget &&
          searchResults.data &&
          searchResults.data.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
              {searchResults.data.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    activeIndex === idx ? "bg-gray-100" : ""
                  }`}
                  onClick={() => selectProduct(item, index)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
        {isSearching && isCurrentSearchTarget && (
          <div className="absolute right-2 top-2">...</div>
        )}
        {errors.products?.[index]?.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.products[index].title.message}
          </p>
        )}
      </div>

      <input
        type="number"
        placeholder="Amount"
        min="0"
        className={`w-1/4 p-2 border rounded ${
          errors.products?.[index]?.amount ? "border-red-500" : ""
        }`}
        {...register(`products.${index}.amount`, INGREDIENT_VALIDATION.amount)}
      />

      <p className="w-1/12 flex items-center justify-center">g.</p>

      <button
        type="button"
        className="text-red-500 text-sm"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
      >
        ✕
      </button>
    </div>
  );
};

export default IngredientField;
