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
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showMethod, setShowMethod] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
        <div className="px-[0.688rem] md:px-[1.25rem] pt-[1.25rem]">
          {/* Recipe Card */}

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-[2.125rem]">
            <img
              src={recipe.data.photo || null}
              alt={recipe.data.title}
              className="w-full rounded-[10px] mb-[0.625rem] lg:col-span-8"
            />
            {/* recipe details */}
            <div className="bg-recipe-fifth px-[1.25rem] pt-[1.25rem] rounded-[10px] lg:col-span-4">
              <div className="relative flex justify-between items-center">
                <div className="pb-[10px]">
                  <h2 className="text-[32px] text-jakarta font-bold mb-[8px]">
                    {recipe.data.title}
                  </h2>
                  <h2>440+ Reviewer</h2>
                </div>
                <FaHeart className="text-red-500 w-[1.25rem] absolute top-[0.5rem] lg:top-[0rem]  right-[0]" />
              </div>
              <p className="text-[16px] text-jakarta text-recipe-eighth tracking-[0.02px] mb-[0.875rem] md:pb-[40px]">
                {recipe.data.description}
              </p>

              <div>
                <div className="grid grid-flow-row grid-cols-2 gap-y-[1rem] gap-x-[2.75rem] max-w-xs mb-[2.188rem] md:mb-[2.5rem] md:w-[330px]">
                  <div className="flex justify-between">
                    <span className="text-[16px] text-recipe-secondary">
                      Protein
                    </span>
                    <span className="text-[16px] font-semibold text-recipe-eighth">
                      34g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[16px] text-recipe-secondary">
                      Fat
                    </span>
                    <span className="text-[16px] font-semibold text-recipe-eighth">
                      30g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[16px] text-recipe-secondary">
                      Carbs
                    </span>
                    <span className="text-[16px] font-semibold text-recipe-eighth">
                      104g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[16px] text-recipe-secondary">
                      Serving
                    </span>
                    <span className="text-[16px] font-semibold text-recipe-eighth">
                      3
                    </span>
                  </div>
                </div>

                <div className="pb-[1.25rem] flex justify-between items-center">
                  <p className="text-[24px] text-jakarta font-bold md:pr-[0.625rem]">
                    642 Cals
                  </p>
                  <button
                    className="bg-recipe-primary text-white px-[1.469rem] py-[1rem] rounded-[4px]"
                    onClick={() => setShowMethod(!showMethod)}
                  >
                    {showMethod ? "Hide Instructions" : "Instructions"}
                  </button>
                </div>
              </div>
            </div>
            {showMethod && (
              <p className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded">
                {recipe.data.method}
              </p>
            )}
          </div>
          <button
            className="bg-recipe-primary text-white px-4 py-1 rounded-lg my-2"
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
