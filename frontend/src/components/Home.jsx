import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import RecipesList from "./RecipesList";
import SomethingAboutMacros from "./SomethingAboutMacros";
import UserContext from "../contexts/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <SomethingAboutMacros />
      <RecipesList />
    </>
  );
};

export default Home;
