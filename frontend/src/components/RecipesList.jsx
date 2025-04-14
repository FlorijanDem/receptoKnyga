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

      // Sukuriame URL parametrus iš filtro objekto ir konteksto filtrų
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
      console.log(error);
    }
  };

  // Reaguojame į filtrų pasikeitimus
  useEffect(() => {
    // Kai pasikeičia filtrai, grįžtame į pirmą puslapį
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

    fetchStats();
  }, [currentQuery, filters, filter]);

  console.log(stats);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <section className="recipes-list-container">
          <h1>Recipes List</h1>
          <div>
            <p>Total recipes: {stats.reduce((acc, s) => acc + +s.count, 0)}</p>
            <p>Approved recipes: {stats.find((s) => s.approved).count}</p>
            <p>Unapproved recipes: {stats.find((s) => !s.approved).count}</p>
          </div>
          <ListPagination
            filter={filter}
            setFilter={setFilter}
            count={recipeCount}
          />
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
