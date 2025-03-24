import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL;

// Form field labels and validation configuration for reusability
const FORM_CONFIG = {
  title: {
    label: "Recipe Title",
    validation: { required: "Title is required" }
  },
  description: {
    label: "Description",
    validation: { required: "Description is required" }
  },
  method: {
    label: "Preparation Method",
    validation: { required: "Method is required" }
  },
  preparation_time: {
    label: "Preparation Time (min)",
    validation: { 
      required: "Preparation time is required",
      min: { value: 1, message: "Must be at least 1 minute" }
    }
  },
  servings: {
    label: "Number of Servings",
    validation: { 
      required: "Servings is required",
      min: { value: 1, message: "Must be at least 1 serving" }
    }
  }
};

function AddRecipe() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const [error, setError] = useState(null);

  // React Hook Form setup
  const { 
    register, 
    handleSubmit: hookFormSubmit, 
    control, 
    formState: { errors }, 
    setValue,
    trigger
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      method: "",
      preparation_time: "",
      servings: "",
      type: "veg",
      photo: "",
      products: [{ title: "", amount: "" }]
    }
  });

  // Field array for dynamic products
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Search products API call
  const searchProducts = useCallback(async (query, index) => {
    if (query.length < 2) return;
    
    setIsSearching(true);
    try {
      const response = await axios.get(`${API_URL}/products/search?query=${query}`);
      setSearchResults({ data: response.data.data, index });
      setActiveIndex(-1);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search to prevent excessive API calls
  const handleProductSearch = useCallback((e, index) => {
    const value = e.target.value;
    setValue(`products.${index}.title`, value);
    
    // Clear any existing timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    if (value.length >= 2) {
      // Set a new timeout
      window.searchTimeout = setTimeout(() => {
        searchProducts(value, index);
      }, 300); // 300ms debounce
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setActiveIndex(-1);
    }
  }, [setValue, searchProducts]);

  const selectProduct = useCallback((product, index) => {
    setValue(`products.${index}.title`, product.title);
    setSearchResults([]);
  }, [setValue]);

  const handleKeyDown = useCallback((e, index) => {
    if (!searchResults.data || searchResults.data.length === 0) return;
    
    // Make sure we're handling keys for the correct product index
    if (searchResults.index !== index) return;
    
    // Down arrow
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => 
        prev < searchResults.data.length - 1 ? prev + 1 : prev
      );
    }
    // Up arrow
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    }
    // Enter key
    else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectProduct(searchResults.data[activeIndex], index);
      setActiveIndex(-1);
    }
    // Escape key
    else if (e.key === "Escape") {
      e.preventDefault();
      setSearchResults([]);
      setActiveIndex(-1);
    }
  }, [searchResults, activeIndex, selectProduct]);

  const addProductField = useCallback(async () => {
    // Validate existing products before adding a new one
    const isValid = await trigger("products");
    if (!isValid) return;
    
    append({ title: "", amount: "" });
  }, [trigger, append]);

  const onSubmit = useCallback(async (data) => {
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/recipes`, data, {
        withCredentials: true,
      });
      navigate(`/recipe/${response.data.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message
          ? `Failed to add recipe.; ${err.response.data.message}`
          : "Failed to add recipe. Please try again."
      );
    }
  }, [navigate]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchResults([]);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, []);

  // Create a reusable form field component
  const FormField = useCallback(({ name, label, type = "text", rows, validation = {} }) => (
    <div>
      <p className="text-gray-600">{label}</p>
      {type === "textarea" ? (
        <textarea
          className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : ''}`}
          rows={rows || 3}
          {...register(name, validation)}
        />
      ) : (
        <input
          type={type}
          className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : ''}`}
          {...register(name, validation)}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  ), [register, errors]);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
        Add Recipe
      </h2>
      {error &&
        error.split("; ").map((errStr, i) => (
          <p key={i} className="text-red-500 text-center">
            {errStr}
          </p>
        ))}
      <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-4">
        <FormField 
          name="title" 
          label={FORM_CONFIG.title.label} 
          validation={FORM_CONFIG.title.validation} 
        />
        
        <FormField 
          name="description" 
          label={FORM_CONFIG.description.label} 
          type="textarea" 
          rows={3} 
          validation={FORM_CONFIG.description.validation} 
        />
        
        <FormField 
          name="method" 
          label={FORM_CONFIG.method.label} 
          type="textarea" 
          rows={4} 
          validation={FORM_CONFIG.method.validation} 
        />
        
        <div className="flex space-x-4">
          <div className="w-1/2">
            <FormField 
              name="preparation_time" 
              label={FORM_CONFIG.preparation_time.label} 
              type="number" 
              validation={FORM_CONFIG.preparation_time.validation} 
            />
          </div>
          <div className="w-1/2">
            <FormField 
              name="servings" 
              label={FORM_CONFIG.servings.label} 
              type="number" 
              validation={FORM_CONFIG.servings.validation} 
            />
          </div>
        </div>
        
        <div>
          <p className="text-gray-600">Recipe Type</p>
          <select
            className="w-full p-2 border rounded"
            {...register("type")}
          >
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
        
        <div>
          <p className="text-gray-600">Photo URL</p>
          <input
            type="text"
            className="w-full p-2 border rounded"
            {...register("photo")}
          />
        </div>
        
        <fieldset className="border p-4 rounded">
          <legend className="text-gray-700 font-semibold">Ingredients</legend>
          {errors.products && (
            <p className="text-red-500 text-sm mb-2">Please check all ingredient fields</p>
          )}
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-2 mb-2">
              <div className="w-3/5 relative" ref={searchResults.index === index ? dropdownRef : null}>
                <input
                  type="text"
                  placeholder="Ingredient Name"
                  className={`w-full p-2 border rounded ${
                    errors.products?.[index]?.title ? 'border-red-500' : ''
                  }`}
                  {...register(`products.${index}.title`, {
                    required: "Ingredient name is required"
                  })}
                  onChange={(e) => handleProductSearch(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
                {searchResults.data && searchResults.data.length > 0 && searchResults.index === index && (
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
                {isSearching && <div className="absolute right-2 top-2">...</div>}
              </div>
              <input
                type="number"
                placeholder="Amount"
                className={`w-1/4 p-2 border rounded ${
                  errors.products?.[index]?.amount ? 'border-red-500' : ''
                }`}
                {...register(`products.${index}.amount`, {
                  required: "Amount is required",
                  min: { value: 1, message: "Minimum amount is 1" },
                  max: { value: 10000, message: "Maximum amount is 10,000" },
                  valueAsNumber: true
                })}
              />
              <p className="w-1/12 flex items-center justify-center">g.</p>
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-blue-500 text-sm"
            onClick={addProductField}
          >
            + Add Ingredient
          </button>
        </fieldset>
        <button
          type="submit"
          className="w-full bg-[#54A6FF] text-white p-2 rounded"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;
