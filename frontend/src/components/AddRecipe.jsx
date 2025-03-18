import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function AddRecipe() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
    products: [{ title: "", amount: "", units_of_meassurement: "" }],
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProductChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value || "",
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const addProductField = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { title: "", amount: "", units_of_meassurement: "" },
      ],
    }));
  };

  const removeProductField = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const finalFormData = {
      ...formData,
      products: formData.products.map((product) => ({
        title: product.title || "",
        amount: product.amount || "",
        units_of_meassurement: product.units_of_meassurement || "",
      })),
    };

    try {
      const response = await axios.post(`${API_URL}/recipes`, finalFormData, {
        withCredentials: true,
      });
      navigate(`/recipe/${response.data.data.id}`);
    } catch (error) {
      setError(error.response?.data?.message && "Failed to add recipe.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
        Add Recipe
      </h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
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
          {formData.products.map((product, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Ingredient Name"
                className="w-1/3 p-2 border rounded"
                required
                value={product.title}
                onChange={(e) =>
                  handleProductChange(index, "title", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Amount"
                className="w-1/3 p-2 border rounded"
                required
                value={product.amount}
                onChange={(e) =>
                  handleProductChange(index, "amount", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Units (e.g., g, ml)"
                className="w-1/3 p-2 border rounded"
                required
                value={product.units_of_meassurement}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "units_of_meassurement",
                    e.target.value
                  )
                }
              />
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
