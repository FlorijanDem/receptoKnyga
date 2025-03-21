import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function AddRecipe() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    method: "",
    preparation_time: "",
    servings: "",
    type: "veg",
    photo: "",
    products: [{ title: "", amount: "" }],
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProductChange = (index, field, value) => {
    // Clear validation error when user starts typing
    setValidationError("");
    
    // Validate amount field
    if (field === "amount") {
      // Convert to number and validate
      const numValue = parseInt(value, 10);
      
      // If it's not a number, empty string, or outside valid range, don't update
      if (isNaN(numValue) || numValue < 1 || numValue > 10000) {
        // If empty, allow it for now (required validation will catch it later)
        if (value === "") {
          // Allow empty string for UX reasons (so user can clear the field)
          setFormData((prev) => {
            const updatedProducts = [...prev.products];
            updatedProducts[index] = {
              ...updatedProducts[index],
              [field]: "",
            };
            return { ...prev, products: updatedProducts };
          });
        }
        return; // Don't update with invalid values
      }
      
      // Update with the valid number
      value = numValue.toString();
    }
    
    setFormData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value || "",
      };
      return { ...prev, products: updatedProducts };
    });

    // If changing title field, search for products
    if (field === "title" && value.length >= 2) {
      searchProducts(value, index);
    } else if (field === "title") {
      setSearchResults([]);
      setIsSearching(false);
      setActiveIndex(-1);
    }
  };

  const searchProducts = async (query, index) => {
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
  };

  const selectProduct = (product, index) => {
    setFormData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        title: product.title,
      };
      return { ...prev, products: updatedProducts };
    });
    setSearchResults([]);
  };

  const handleKeyDown = (e, index) => {
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
  };

  const validateProductFields = () => {
    // Check if any product has empty fields
    const hasEmptyFields = formData.products.some(
      product => !product.title.trim() || !product.amount.trim()
    );
    
    if (hasEmptyFields) {
      setValidationError("Please fill in all ingredient fields before adding a new one");
      return false;
    }
    
    // Check if any amount is invalid
    const hasInvalidAmount = formData.products.some(product => {
      const amount = parseInt(product.amount, 10);
      return isNaN(amount) || amount < 1 || amount > 10000;
    });
    
    if (hasInvalidAmount) {
      setValidationError("Amount must be a whole number between 1 and 10,000");
      return false;
    }
    
    return true;
  };

  const addProductField = () => {
    // Validate existing products before adding a new one
    if (!validateProductFields()) {
      return;
    }
    
    setValidationError("");
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { title: "", amount: "" },
      ],
    }));
  };

  const removeProductField = (index) => {
    setValidationError("");
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationError("");

    // Validate all products before submission
    if (!validateProductFields()) {
      return;
    }

    const finalFormData = {
      ...formData,
      products: formData.products.map((product) => ({
        title: product.title || "",
        amount: product.amount || "",
      })),
    };

    try {
      const response = await axios.post(`${API_URL}/recipes`, finalFormData, {
        withCredentials: true,
      });
      navigate(`/recipe/${response.data.data.id}`);
    } catch (error) {
      setError(
        error.response?.data?.message &&
          `Failed to add recipe.; ${error.response.data.message}`
      );
    }
  };

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-gray-600">Recipe Title</p>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-gray-600">Description</p>
          <textarea
            name="description"
            className="w-full p-2 border rounded"
            rows="3"
            required
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-gray-600">Preparation Method</p>
          <textarea
            name="method"
            className="w-full p-2 border rounded"
            rows="4"
            required
            value={formData.method}
            onChange={handleChange}
          />
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <p className="text-gray-600">Preparation Time (min)</p>
            <input
              type="number"
              name="preparation_time"
              className="w-full p-2 border rounded"
              required
              value={formData.preparation_time}
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2">
            <p className="text-gray-600">Number of Servings</p>
            <input
              type="number"
              name="servings"
              className="w-full p-2 border rounded"
              required
              value={formData.servings}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <p className="text-gray-600">Recipe Type</p>
          <select
            name="type"
            className="w-full p-2 border rounded"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
        <div>
          <p className="text-gray-600">Photo URL</p>
          <input
            type="text"
            name="photo"
            className="w-full p-2 border rounded"
            value={formData.photo}
            onChange={handleChange}
          />
        </div>
        <fieldset className="border p-4 rounded">
          <legend className="text-gray-700 font-semibold">Ingredients</legend>
          {validationError && (
            <p className="text-red-500 text-sm mb-2">{validationError}</p>
          )}
          {formData.products.map((product, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <div className="w-3/5 relative" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Ingredient Name"
                  className="w-full p-2 border rounded"
                  required
                  value={product.title}
                  onChange={(e) =>
                    handleProductChange(index, "title", e.target.value)
                  }
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
                className="w-1/4 p-2 border rounded"
                required
                min="1"
                max="10000"
                value={product.amount}
                onChange={(e) =>
                  handleProductChange(index, "amount", e.target.value)
                }
              />
              <p className="w-1/12 flex items-center justify-center">g.</p>
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={() => removeProductField(index)}
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
