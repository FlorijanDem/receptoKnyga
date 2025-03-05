import axios from "axios";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import RecipePreviewCard from "./RecipePreviewCard";

const API_URL = import.meta.env.VITE_API_URL;

const RecipesList = () => {
  const [filter, setFilter] = useState({ page: 1, limit: 12 });
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  console.log(recipes);
  console.log(recipeCount);

  const prevPage = () => {
    if (filter.page > 1) {
      setFilter((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const nextPage = () => {
    if (filter.page < Math.ceil(recipeCount / filter.limit)) {
      setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data: response } = await axios.get(
          `${API_URL}/recipes?page=${filter.page}&limit=${filter.limit}`,
          {
            withCredentials: true,
          }
        );

        setRecipes(response.data);
        setRecipeCount(+response.results);
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

    fetchRecipes();
  }, [filter]);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <section className="recipes-list-container">
          <h1>Recipes List</h1>
          <div className="recipes-list">
            {recipes?.length === 0 && <p>No recipes found</p>}
            {recipes.map((recipe) => (
              <RecipePreviewCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="pagination">
            <button onClick={prevPage}>{"<<"}</button>
            <p>
              Page {filter.page} of {Math.ceil(recipeCount / filter.limit)}
            </p>
            <button onClick={nextPage}>{">>"}</button>
          </div>
        </section>
      )}
    </>
  );
};

export default RecipesList;
