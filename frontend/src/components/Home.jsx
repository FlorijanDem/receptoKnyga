import axios from "axios";
import { useEffect, useState } from "react";
import RecipesList from "./RecipesList";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/recipes`, {
          withCredentials: true,
        });

        console.log(API_URL);

        console.log(response.data);
        console.log(response);

        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
  }, []);
  return (
    <>
      <h1>Recipes</h1>
      {loading ? <p>...Loading</p> : <RecipesList recipes={recipes} />}
    </>
  );
};

export default Home;
