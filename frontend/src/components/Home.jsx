import axios from "axios";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import RecipesList from "./RecipesList";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/recipess`, {
          withCredentials: true,
        });

        setRecipes(response.data);
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
          showBoundary(error);
        }
      }
    };

    fetchRecipes();
  }, []);
  return (
    <>
      <h1>Recipes</h1>
      {loading ? (
        <p>...Loading</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <RecipesList recipes={recipes} />
      )}
    </>
  );
};

export default Home;
