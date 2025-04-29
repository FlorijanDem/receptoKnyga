import { useState, useEffect } from "react";
import axios from "axios";
import RecipePreviewCard from "./RecipePreviewCard";

const API_URL = import.meta.env.VITE_API_URL;

const UserRecipesList = () => {
  const [usersRecipes, setUsersRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersRecipes = async () => {
      try {
        const { data: response } = await axios.get(
          `${API_URL}/recipes/myrecipes`,
          {
            withCredentials: true,
          }
        );
        setUsersRecipes(response?.data);
      } catch (err) {
        console.log(err);
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data.message);
          } else if (err.request) {
            setError("Something went wrong. Please try again later.");
          } else {
            setError("Network error. Please check your internet connection.");
          }
        }
      }
    };
    fetchUsersRecipes();
  }, []);

  return (
    <>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <section className="recipes-list-container">
          <h1>Recipes List</h1>

          {/* <ListPagination
          filter={filter}
          setFilter={setFilter}
          count={recipeCount}
          /> */}
          <div className="recipes-list">
            {usersRecipes?.length === 0 && <p>No recipes found</p>}
            {usersRecipes.map((recipe) => (
              <RecipePreviewCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          {/* <ListPagination
          filter={filter}
          setFilter={setFilter}
          count={recipeCount}
          /> */}
        </section>
      )}
    </>
  );
};

export default UserRecipesList;
