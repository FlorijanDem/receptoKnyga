import React from "react";
import { FaHeart, FaClock, FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import RecipePageControls from "./RecipePageControls";
import WriteReview from "./WriteReview";
import RecipeReviews from "./RecipeReviews";

const API_URL = import.meta.env.VITE_API_URL;

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const [refresh, setRefresh] = useState(false);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, refresh]);
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
            <RecipePageControls
              recipe={recipe.data}
              setRecipe={setRecipe}
              setRefresh={setRefresh}
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded-lg my-2"
            onClick={() => backToList()}
          >
            Back to recipe list
          </button>
          <RecipeReviews refresh={refresh} />
          <WriteReview
            recipe_id={id}
            setRefresh={setRefresh}
            isLoggedIn={true}
          />
        </div>
      )}
    </>
  );
};

export default RecipePage;
