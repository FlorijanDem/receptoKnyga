import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import RecipePreviewCard from "./RecipePreviewCard";
import RecipesListPagination from "./RecipesListPagination";
import SearchContext from "../contexts/SearchContext";

const API_URL = import.meta.env.VITE_API_URL;

const RecipesList = ({ filter, setFilter }) => {
  const { currentQuery } = useContext(SearchContext);
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  const fetchRecipes = async (query = "") => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `${API_URL}/recipes?page=${filter.page}&limit=${filter.limit}${query ? `&q=${query}` : ''}`,
        {
          withCredentials: true,
        }
      );

      setRecipes(response.data);
      setRecipeCount(response.results);
      setError(null);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        showBoundary(error);
      }
    }
  };

  useEffect(() => {
    fetchRecipes(currentQuery);
  }, [filter, currentQuery]);

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
