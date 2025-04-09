import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import RecipePageControls from "./RecipePageControls";
import WriteReview from "./WriteReview";
import RecipeReviews from "./RecipeReviews";

const API_URL = import.meta.env.VITE_API_URL;

// Style constants
const TEXT_STYLES = {
  macro: "text-[16px] 2xl:text-[24px] font-semibold text-recipe-eighth",
  label: "text-[16px] 2xl:text-[24px] text-recipe-secondary",
  title: "text-[32px] 2xl:text-[44px] text-jakarta font-bold mb-[8px]",
  description:
    "text-[16px] 2xl:text-[24px] text-jakarta text-recipe-eighth tracking-[0.02px] mb-[0.875rem] md:pb-[40px]",
  calories:
    "text-[24px] 2xl:text-[32px] text-jakarta font-bold md:pr-[0.625rem]",
  method:
    "text-jakarta text-[14px] 2xl:text-[24px] text-gray-800 bg-gray-100 p-2 rounded",
  button: "bg-recipe-primary text-white px-4 py-1 rounded-lg",
};

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMethod, setShowMethod] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipes/${id}`, {
          withCredentials: true,
        });
        setRecipe(response.data);
        setError(null);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, refresh]);

  const handleError = (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) return setError(error.response.data.message);
      if (error.request)
        return setError("Something went wrong. Please try again later.");
      return setError("Network error. Please check your internet connection.");
    }
    setError(error);
  };

  const backToList = () => navigate("/");

  const NutritionGrid = () => (
    <div className="grid grid-cols-2 gap-y-4 gap-x-11 max-w-xs mb-10 md:mb-[2.5rem] md:w-[330px]">
      {[
        { label: "Protein", value: "34g" },
        { label: "Fat", value: "30g" },
        { label: "Carbs", value: "104g" },
        { label: "Serving", value: "3" },
      ].map((item) => (
        <div key={item.label} className="flex justify-between">
          <span className={TEXT_STYLES.label}>{item.label}</span>
          <span className={TEXT_STYLES.macro}>{item.value}</span>
        </div>
      ))}
    </div>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="px-3 md:px-5 pt-5">
      <div className="lg:flex lg:gap-x-8">
        {/* Image Section */}
        <div className="lg:flex-1">
          <img
            src={recipe.data.photo || null}
            alt={recipe.data.title}
            className="w-full h-full object-cover rounded-lg mb-2.5 lg:mb-0"
          />
        </div>

        {/* Details Section */}
        <div className="lg:flex-1 bg-recipe-fifth px-5 pt-5 rounded-lg flex flex-col">
          <div className="relative flex justify-between items-center pb-2.5">
            <div>
              <h2 className={TEXT_STYLES.title}>{recipe.data.title}</h2>
              {/* temp */}
              <h2 className={TEXT_STYLES.calories}>440+ Reviewers</h2>
            </div>
            <FaHeart className="text-red-500 w-5 absolute top-2 lg:top-0 right-0" />
          </div>
          <p className={TEXT_STYLES.description}>{recipe.data.description}</p>

          <div className="flex-1">
            <NutritionGrid />
            <div className="pb-5 flex justify-between items-center">
              <p className={TEXT_STYLES.calories}>642 Cals</p>
              <button
                className={`${TEXT_STYLES.button} px-6 py-4 2xl:px-8 2xl:py-6 rounded`}
                onClick={() => setShowMethod(!showMethod)}
              >
                {showMethod ? "Hide Instructions" : "Instructions"}
              </button>
            </div>
          </div>
        </div>

        {showMethod && (
          <div className="lg:col-span-2 mt-2">
            <p className={TEXT_STYLES.method}>{recipe.data.method}</p>
          </div>
        )}
      </div>

      <button className={`${TEXT_STYLES.button} my-2`} onClick={backToList}>
        Back to recipe list
      </button>

      <RecipeReviews refresh={refresh} />
      <WriteReview recipe_id={id} setRefresh={setRefresh} isLoggedIn={true} />
    </div>
  );
};

export default RecipePage;
