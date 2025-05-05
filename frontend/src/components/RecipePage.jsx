import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import RecipePageControls from "./RecipePageControls";
import WriteReview from "./WriteReview";
import RecipeReviews from "./RecipeReviews";
import { useErrorBoundary } from "react-error-boundary";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

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

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/reviews/${id}`, {
          withCredentials: true,
        });
        const { data: reviews } = response.data;

        if (!Array.isArray(reviews)) {
          setAverageRating(null);
          setReviewCount(0);
          return;
        }

        const approved = reviews.filter(
          (r) => r.approved === true && typeof r.rating === "number"
        );

        if (approved.length > 0) {
          const total = approved.reduce((sum, r) => sum + r.rating, 0);
          const avg = total / approved.length;
          setAverageRating(avg);
          setReviewCount(approved.length);
        } else {
          setAverageRating(null);
          setReviewCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setAverageRating(null);
        setReviewCount(0);
      }
    };

    fetchRecipe();
    fetchReviews();
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

  const NutritionGrid = () => {
    const macros = [
      { label: "Protein", value: recipe?.data?.proteins || "N/A" },
      { label: "Fat", value: recipe?.data?.fats || "N/A" },
      { label: "Carbs", value: recipe?.data?.carbohydrates || "N/A" },
      { label: "Serving", value: recipe?.data?.servings || "N/A" },
    ];

    return (
      <div className="grid grid-cols-2 gap-y-4 gap-x-11 max-w-xs mb-10 md:mb-[2.5rem] md:w-[330px]">
        {macros.map((item) => (
          <div key={item.label} className="flex justify-between">
            <span className={TEXT_STYLES.label}>{item.label}</span>
            <span className={TEXT_STYLES.macro}>{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="px-3 md:px-5 pt-5">
      <div className="lg:flex lg:gap-x-8">
        {!showMethod ? (
          <>
            {/* Image Section */}
            <div className="lg:flex-1">
              <img
                src={recipe.data.photo || null}
                alt={recipe.data.title}
                className="w-full max-h-[30rem] object-cover rounded-lg mb-2.5 lg:mb-0"
              />
            </div>

            {/* Details Section */}
            <div className="lg:flex-1 bg-recipe-fifth px-5 pt-5 rounded-lg flex flex-col">
              <div className="relative flex justify-between items-center pb-2.5">
                <div>
                  <h2 className={TEXT_STYLES.title}>{recipe.data.title}</h2>
                  <div className="flex items-center">
                    {averageRating !== null ? (
                      <>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => {
                            const ratingValue = i + 1;
                            if (averageRating >= ratingValue) {
                              return (
                                <FaStar key={i} className="text-yellow-400" />
                              );
                            } else if (averageRating >= ratingValue - 0.5) {
                              return (
                                <FaStarHalfAlt
                                  key={i}
                                  className="text-yellow-400"
                                />
                              );
                            } else {
                              return (
                                <FaRegStar
                                  key={i}
                                  className="text-yellow-400"
                                />
                              );
                            }
                          })}
                        </div>
                        <span className="ml-2">
                          ({averageRating.toFixed(1)}) {reviewCount} reviews
                        </span>
                      </>
                    ) : (
                      <span>No reviews yet</span>
                    )}
                  </div>
                </div>
              </div>
              <p className={TEXT_STYLES.description}>
                {recipe.data.description}
              </p>

              <div className="flex-1">
                <NutritionGrid />
                <div className="pb-5 flex justify-between items-center">
                  <p className={TEXT_STYLES.calories}>
                    {recipe.data.calories} Cals
                  </p>
                  <button
                    className={`${TEXT_STYLES.button} px-6 py-4 2xl:px-8 2xl:py-6 rounded`}
                    onClick={() => setShowMethod(true)}
                  >
                    Instructions
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Description Side */}
            <div className="lg:flex-1 bg-recipe-fifth px-5 pt-5 rounded-lg flex flex-col">
              <h2 className={TEXT_STYLES.title}>{recipe.data.title}</h2>
              <p className={TEXT_STYLES.description}>
                {recipe.data.description}
              </p>
              <NutritionGrid />
              <p className={TEXT_STYLES.calories}>
                {recipe.data.calories} Cals
              </p>
              <button
                className={`${TEXT_STYLES.button} mt-4`}
                onClick={() => setShowMethod(false)}
              >
                Back
              </button>
            </div>

            {/* Instructions Side */}
            <div className="lg:flex-1 bg-gray-100 px-5 py-5 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Instructions</h3>
              <p className={TEXT_STYLES.method}>{recipe.data.method}</p>
            </div>
          </>
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
