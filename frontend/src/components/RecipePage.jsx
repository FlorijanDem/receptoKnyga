import React from "react";
import { FaHeart, FaClock, FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import RecipePageControls from "./RecipePageControls";
const API_URL = import.meta.env.VITE_API_URL;

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showMethod, setShowMethod] = useState(false);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipes/${id}`, {
          withCredentials: true,
        });
        setRecipe(response.data);
        setError(null);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setError(error.response.data.message);
          } else if (error.request) {
            setError("Something went wrong. Please try again later.");
          } else {
            setError("Network error. Please check your internet connection.");
          }
        } else {
          setError(error);
        }
      }
    };
    fetchRecipe();
  }, [id]);
  const navigate = useNavigate();

  const backToList = () => {
    navigate(`/`);
  };
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="p-4 max-w-md mx-auto">
          {/* Recipe Card */}

          <div className="bg-white shadow-md rounded-lg p-4">
            <img
              src={recipe.data.photo || null}
              alt={recipe.data.title}
              className="w-full rounded-lg mb-2"
            />
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{recipe.data.title}</h2>
              {/* <FaHeart className="text-red-500" /> */}
            </div>
            <p className="text-sm text-gray-600">{recipe.data.description}</p>
            <p className="text-sm text-gray-600">Type: {recipe.data.type}</p>
            <p className="text-sm text-gray-600">
              Preparation time: {recipe.data.preparation_time} m.
            </p>
            <div className="flex justify-between text-sm mt-2">
              <span>Protein: 34g</span>
              <span>Fat: 30g</span>
              <span>Carbs: 104g</span>
            </div>
            <div className="mt-2 flex justify-between">
              <p className="text-xl font-bold">642 Cals</p>
              <button
                className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                onClick={() => setShowMethod(!showMethod)}
              >
                {showMethod ? "Hide Instructions" : "Instructions"}
              </button>
            </div>
            {showMethod && (
              <p className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded">
                {recipe.data.method}
              </p>
            )}
            <RecipePageControls recipe={recipe.data} setRecipe={setRecipe} />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded-lg my-2"
            onClick={() => backToList()}
          >
            Back to recipe list
          </button>
        </div>
      )}
    </>

    /* Reviews */
    /* <h3 className="text-lg font-bold mt-4">Reviews (13)</h3>
      <div className="border p-2 rounded-lg mt-2">
        <div className="flex items-center">
          <img
            src="/user1.jpg"
            className="w-10 h-10 rounded-full mr-2"
            alt="User"
          />
          <div>
            <p className="font-bold">Alex Stanton</p>
            <p className="text-gray-500 text-sm">⭐⭐⭐⭐⭐ 21 July 2022</p>
          </div>
        </div>
        <p className="text-sm mt-2">
          This recipe is amazing! The pasta sauce is rich and creamy...
        </p>
      </div> */

    /* Recent Recipes */
    /* <h3 className="text-lg font-bold mt-4">Recent Recipes</h3> */
    /* {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-lg p-2 flex items-center mt-2"
        >
          <img
            src="/pancake.jpg"
            className="w-16 h-16 rounded-lg mr-2"
            alt="Sweet Potato Pancakes"
          />
          <div>
            <h4 className="font-bold">Sweet Potato Pancakes</h4>
            <p className="text-sm text-gray-500 flex items-center">
              400 Cals <FaClock className="mx-1" /> 30 min{" "}
              <FaUsers className="mx-1" /> 2 People
            </p>
          </div>
        </div>
      ))} */
  );
};

export default RecipePage;
