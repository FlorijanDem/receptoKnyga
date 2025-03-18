import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RecipesList from "./RecipesList";
import SomethingAboutMacros from "./SomethingAboutMacros";
import UserContext from "../contexts/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ page: 1, limit: 12 });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <SomethingAboutMacros />
      <RecipesList filter={filter} setFilter={setFilter} />
    </>
  );
};

export default Home;
