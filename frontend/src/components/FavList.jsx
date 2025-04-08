import axios from "axios";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import RecipePreviewCard from "./RecipePreviewCard";
import Sidebar from "../components/Sidebar";
const API_URL = import.meta.env.VITE_API_URL;

const FavList = ({ userId = null, showAll = false }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  const fetchFavoriteRecipes = async () => {
    try {
      setLoading(true);

      let favoriteIds = new Set();
      let allRecipes = [];

      if (showAll) {
        // Fetch all users' favorites
        const favoritesResponse = await axios.get(`${API_URL}/favorites`, {
          withCredentials: true,
        });
        const allFavorites = favoritesResponse.data.data;

        // Fetch all recipes once
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const recipesResponse = await axios.get(`${API_URL}/recipes`, {
            withCredentials: true,
            params: { page: page, limit: 50 },
          });
          const { data, results } = recipesResponse.data;
          allRecipes = allRecipes.concat(data);
          hasMore = allRecipes.length < results && data.length > 0;
          page += 1;
        }

        // Map all favorites to recipes
        const favoriteRecipesData = allFavorites.flatMap((userFavorites) => {
          const userFavoriteIds = new Set(userFavorites.recipe_ids);
          return allRecipes
            .filter((recipe) => userFavoriteIds.has(recipe.id))
            .map((recipe) => ({
              ...recipe,
              isFavorite: true,
              userId: userFavorites.user_id, // Include userId for display
            }));
        });

        setFavoriteRecipes(favoriteRecipesData);
      } else {
        // Fetch favorites for a specific user (or current user if userId is null)
        const endpoint = userId
          ? `${API_URL}/favorites/${userId}`
          : `${API_URL}/favorites`;
        const favoritesResponse = await axios.get(endpoint, {
          withCredentials: true,
        });
        favoriteIds = new Set(favoritesResponse.data.data);

        // Fetch recipes
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const recipesResponse = await axios.get(`${API_URL}/recipes`, {
            withCredentials: true,
            params: { page: page, limit: 50 },
          });
          const { data, results } = recipesResponse.data;
          allRecipes = allRecipes.concat(data);
          hasMore = allRecipes.length < results && data.length > 0;
          page += 1;
        }

        // Filter favorites
        const favoriteRecipesData = allRecipes
          .filter((recipe) => favoriteIds.has(recipe.id))
          .map((recipe) => ({
            ...recipe,
            isFavorite: true,
          }));

        setFavoriteRecipes(favoriteRecipesData);
      }

      setError(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Please log in to view favorite recipes.");
        } else if (error.response) {
          setError(error.response.data.message);
        } else if (error.request) {
          setError("Something went wrong. Please try again later.");
        } else {
          setError("Network error. Please check your internet connection.");
        }
      } else {
        showBoundary(error);
      }
    }
  };

  useEffect(() => {
    fetchFavoriteRecipes();
  }, [userId, showAll]);

  return (
    <div className="flex flex-col md:flex-row bg-recipe-sixth">
      <nav className="hidden lg:block md:w-[286px] ">
        <Sidebar isOpen={true}></Sidebar>
      </nav>
      <section className="pt-[40px] md:pl-[40px]">
        <h1 className="text-recipe-secondary font-jakarta font-[500] text-[16px] pb-[27px]">
          {showAll
            ? "All Users' Favorite Recipes"
            : userId && `Favorite Recipes`}
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : favoriteRecipes.length === 0 ? (
          <p className="text-center text-gray-500">
            {showAll
              ? "No favorite recipes found for any user."
              : userId
              ? "This user hasn’t favorited any recipes yet."
              : "You haven’t favorited any recipes yet."}
          </p>
        ) : (
          <div className="flex flex-col gap-[32px] items-center md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {favoriteRecipes.map((recipe) => (
              <RecipePreviewCard
                key={`${recipe.userId || "current"}-${recipe.id}`}
                recipe={recipe}
                showUser={showAll} // Pass prop to show userId if showing all
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FavList;
