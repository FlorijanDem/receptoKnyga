import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const AddRecipeModal = ({ isOpen, onClose, onSubmit, defaultDate }) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(defaultDate);
  const [hour, setHour] = useState(format(new Date(), "HH"));
  const [minute, setMinute] = useState(format(new Date(), "mm"));
  const [recipeTitle, setRecipeTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (recipeTitle) {
      const fetchSuggestions = async () => {
        try {
          const res = await axios.get(`${API_URL}/recipes/search?q=${recipeTitle}`, {
            withCredentials: true,
          });
          setSuggestions(res.data?.data || []);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [recipeTitle]);

  const handleSubmit = () => {
    const datetime = `${format(date, "yyyy-MM-dd")} ${hour}:${minute}:00`;
    onSubmit({ recipeTitle, datetime });
    setRecipeTitle("");
    setSuggestions([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Consumed Recipe</h3>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Time</label>
          <div className="flex gap-2">
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="border rounded px-3 py-2 w-1/2"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="border rounded px-3 py-2 w-1/2"
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Recipe Title</label>
          <input
            type="text"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          {suggestions.length > 0 && (
            <ul className="mt-2 border rounded bg-white max-h-40 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setRecipeTitle(suggestion.title)}
                >
                  {suggestion.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;