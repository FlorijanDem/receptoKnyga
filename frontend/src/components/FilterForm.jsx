import React, { useState, useEffect, useContext, useRef } from "react";
import SearchContext from "../contexts/SearchContext";

const FilterForm = ({ isOpen, onClose }) => {
  const { filters, setFilters, currentQuery, setCurrentQuery } = useContext(SearchContext);
  const [localFilters, setLocalFilters] = useState({
    type: "",
    product: "",
  });
  const productTimeoutRef = useRef(null);

  // Update local filters when context filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Clear local filters when form is closed
  useEffect(() => {
    if (!isOpen) {
      setLocalFilters({
        type: "",
        product: "",
      });
    }
  }, [isOpen]);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (productTimeoutRef.current) {
        clearTimeout(productTimeoutRef.current);
      }
    };
  }, []);

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    
    // Construct new query with filters
    let queryParams = new URLSearchParams();
    
    if (currentQuery) {
      queryParams.append('q', currentQuery);
    }
    
    if (newFilters.type) {
      queryParams.append('type', newFilters.type);
    }
    
    if (newFilters.product) {
      queryParams.append('product', newFilters.product);
    }
    
    // Update currentQuery to trigger useEffect in RecipesList component
    setCurrentQuery(currentQuery);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newLocalFilters = {
      ...localFilters,
      [name]: value,
    };
    
    setLocalFilters(newLocalFilters);
    
    // If type is changed, apply filters immediately
    if (name === 'type') {
      applyFilters(newLocalFilters);
    }
    
    // If product is changed, apply filters only if there are 3 or more characters
    // or if the field is empty (filter is cleared)
    if (name === 'product') {
      // Clear previous timeout
      if (productTimeoutRef.current) {
        clearTimeout(productTimeoutRef.current);
      }
      
      // If 3 or more characters are entered or the field is empty, apply filters after 300ms
      if (value.length >= 3 || value.length === 0) {
        productTimeoutRef.current = setTimeout(() => {
          applyFilters(newLocalFilters);
        }, 300);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters(localFilters);
    onClose(); // Close form after applying filters
  };

  const handleReset = () => {
    const emptyFilters = {
      type: "",
      product: "",
    };
    
    setLocalFilters(emptyFilters);
    applyFilters(emptyFilters);
  };

  const handleClearProduct = () => {
    const newFilters = {
      ...localFilters,
      product: ""
    };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-white shadow-md p-4 absolute top-full left-0 z-40 max-h-[calc(100vh-200px)] overflow-y-auto">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="type">
              Recipe Type
            </label>
            <select
              id="type"
              name="type"
              value={localFilters.type}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-[#C3D4E9] rounded-md focus:outline-none focus:ring-2 focus:ring-recipe-primary appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.5rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.5em 1.5em`,
                paddingRight: `2.5rem`
              }}
            >
              <option value="">All types</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-vegetarian</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="product">
              Product
            </label>
            <div className="relative">
              <input
                type="text"
                id="product"
                name="product"
                value={localFilters.product}
                onChange={handleChange}
                placeholder="Enter product name (min. 3 characters)"
                className="w-full px-3 py-2 text-gray-700 bg-white border border-[#C3D4E9] rounded-md focus:outline-none focus:ring-2 focus:ring-recipe-primary"
              />
              {localFilters.product && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  onClick={handleClearProduct}
                  aria-label="Clear product"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Clear Filters
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-recipe-primary text-white rounded-md hover:bg-recipe-primary-dark"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;
