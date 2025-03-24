import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import RecipePreviewCard from "./RecipePreviewCard";
import RecipesListPagination from "./RecipesListPagination";
import SearchContext from "../contexts/SearchContext";

const API_URL = import.meta.env.VITE_API_URL;

const RecipesList = ({ filter, setFilter }) => {
  const { currentQuery, filters } = useContext(SearchContext);
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  const fetchRecipes = async (query = "") => {
    try {
      setLoading(true);

      // Fetch current user's ID
      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      const userId = userResponse.data.user.id;

      // Fetch user's favorites
      const favoritesResponse = await axios.get(
        `${API_URL}/favorites/${userId}`,
        {
          withCredentials: true,
        }
      );
      const favoriteIds = new Set(favoritesResponse.data.data);

      // Fetch recipes with pagination
      const params = new URLSearchParams();
      params.append("page", filter.page);
      params.append("limit", filter.limit);
      if (query) params.append("q", query);
      if (filters.type) params.append("type", filters.type);
      if (filters.product) params.append("product", filters.product);

      const recipesResponse = await axios.get(
        `${API_URL}/recipes?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      const recipesWithFavorites = recipesResponse.data.data.map((recipe) => ({
        ...recipe,
        isFavorite: favoriteIds.has(recipe.id),
      }));

      setRecipes(recipesWithFavorites);
      setRecipeCount(recipesResponse.data.results);
      setError(null);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Please log in to view recipes.");
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
    setFilter((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [filters, setFilter]);

  useEffect(() => {
    fetchRecipes(currentQuery);
  }, [filter, currentQuery, filters]);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <section className="recipes-list-container">
          <h1>Recipes List</h1>
          <RecipesListPagination
            filter={filter}
            setFilter={setFilter}
            recipeCount={recipeCount}
          />
          <div className="recipes-list">
            {recipes?.length === 0 && <p>No recipes found</p>}
            {recipes.map((recipe) => (
              <RecipePreviewCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <RecipesListPagination
            filter={filter}
            setFilter={setFilter}
            recipeCount={recipeCount}
          />
        </section>
      )}
    </>
  );
};

export default RecipesList;
