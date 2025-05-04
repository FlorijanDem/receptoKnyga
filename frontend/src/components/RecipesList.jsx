import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import RecipePreviewCard from "./RecipePreviewCard";
import ListPagination from "./ListPagination";
import SearchContext from "../contexts/SearchContext";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import UserContext from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const RecipesList = ({ filter, setFilter }) => {
  const { currentQuery, filters } = useContext(SearchContext);
  const { adminFilters } = useContext(AdminFilterContext);
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [stats, setStats] = useState([]);
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
      if (filters.order) params.append("order", filters.order);
      if (adminFilters?.value !== "all" && user?.role === "admin") {
        params.append(adminFilters.name, adminFilters.value);
      } else if (user?.role !== "admin") {
        params.append("approved", "true");
      }

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
      console.log(error);
    }
  };

  // React to filter changes
  useEffect(() => {
    // When filters change, return to first page
    setFilter((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [filters, setFilter, adminFilters]);

  useEffect(() => {
    if (filters.order) {
      setFilter((prev) => ({ ...prev, page: 1 }));
    }
  }, [filters.order, setFilter]);

  useEffect(() => {
    fetchRecipes(currentQuery);

    const fetchStats = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/recipes/stats`, {
          withCredentials: true,
        });
        setStats(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (user?.role === "admin") fetchStats();
  }, [currentQuery, filters, filter]);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <section className="recipes-list-container">
          <h1 className="text-recipe-secondary font-jakarta font-[500] text-[16px] pb-[27px]">
            Recipe List
          </h1>
          {user?.role === "admin" && (
            <div>
              <p>
                Total recipes: {stats.reduce((acc, s) => acc + +s.count, 0)}
              </p>
              <p>Approved recipes: {stats.find((s) => s.approved)?.count}</p>
              <p>Unapproved recipes: {stats.find((s) => !s.approved)?.count}</p>
            </div>
          )}

          {/* <ListPagination
            filter={filter}
            setFilter={setFilter}
            count={recipeCount}
          /> */}
          <div className="recipes-list">
            {recipes?.length === 0 && <p>No recipes found</p>}
            {recipes.map((recipe) => (
              <RecipePreviewCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <ListPagination
            filter={filter}
            setFilter={setFilter}
            count={recipeCount}
          />
        </section>
      )}
    </>
  );
};

export default RecipesList;
