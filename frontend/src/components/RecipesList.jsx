import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import RecipePreviewCard from "./RecipePreviewCard";
import RecipesListPagination from "./RecipesListPagination";
import SearchContext from "../contexts/SearchContext";
import UserContext from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const RecipesList = ({ filter, setFilter }) => {
  const { currentQuery, filters } = useContext(SearchContext);
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  const fetchRecipes = async (query = "") => {
    try {
      setLoading(true);

      if (!user) {
        throw new Error("Please log in to view recipes.");
      }
      const userId = user.id;

      // Fetch user's favorites
      const favoritesResponse = await axios.get(
        `${API_URL}/favorites/${userId}`,
        {
          withCredentials: true,
        }
      );
      const favoriteIds = new Set(favoritesResponse.data.data);

      // Create URL parameters from filter object and context filters
      const params = new URLSearchParams();
      params.append("page", filter.page);
      params.append("limit", filter.limit);
      if (query) params.append("q", query);
      if (filters.type) params.append("type", filters.type);
      if (filters.product) params.append("product", filters.product);

      const { data: response } = await axios.get(
        `${API_URL}/recipes?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      const recipesWithFavorites = response.data.map((recipe) => ({
        ...recipe,
        isFavorite: favoriteIds.has(recipe.id),
      }));

      setRecipes(recipesWithFavorites);
      setRecipeCount(response.results);
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
        setError(error.message); // Handle the case where user is null
        if (!(error instanceof Error)) {
          showBoundary(error);
        }
      }
    }
  };

  // React to filter changes
  useEffect(() => {
    // When filters change, return to first page
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
