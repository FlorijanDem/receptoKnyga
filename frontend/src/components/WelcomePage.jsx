import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

const WelcomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const StyleText = "font-jakarta font-extrabold text-recipe-third";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipes`);
        setRecipes(response.data.data); // Set the fetched recipes
      } catch (err) {
        setError(`Failed to load recipes. ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const logintemp = () => {
    return (
      <Link to="/login">
        <button className={`${StyleText} md:mb-[10px]`}>
          <span className="flex border-b-3 border-recipe-third mb-[-1px]">
            <span className="text-[24px] md:text-[10px] 2xl:text-[20px]">
              LOGIN
            </span>
          </span>
        </button>
      </Link>
    );
  };

  return (
    <>
      <header className=" ml-[2.375rem] mt-[1rem] mb-[3.75rem]">
        <div className="hidden md:block">{logintemp()}</div>

        <div className="md:flex justify-between">
          <h1
            className={`${StyleText} text-[35px] md:text-[50px] lg:text-[60px] 2xl:text-[80px] text-sm/[110%] mb-[1rem]`}
          >
            Hi,we are <span className="text-recipe-primary">Calibrium</span>,
            <br />
            Macro tracker. <br />
            Cook book.
          </h1>

          <p
            className={`${StyleText} md:text-[20px] lg:text-[24px] 2xl:text-[50px] hidden md:block text-sm/[100%]`}
          >
            We specialize in helping you achieve{" "}
            <br className="hidden md:block" /> your health goals through
            personalized <br className="hidden md:block" /> calorie tracking and
            tailored recipe suggestions. <br className="hidden md:block" />
            With our slogan 'For those who want to change,'{" "}
            <br className="hidden md:block" /> we make it easy to enjoy
            nutritious meals and stay <br className="hidden md:block" /> on
            track with your fitness journey.
          </p>
        </div>

        <div className="md:hidden">{logintemp()}</div>
      </header>
      <main>
        <div className="columns-2 md:columns-3 lg:columns-4 2xl:columns-5 gap-1.25 bg-recipe-fifth">
          {loading && <p>Loading recipes...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {recipes.map((recipe) => (
            <Link to={`/login`} key={recipe.id}>
              <div className="break-inside-avoid mb-1.25 group relative overflow-hidden bg-recipe-third">
                <img
                  src={recipe.photo}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition duration-400 ease-in-out group-hover:scale-110 group-hover:opacity-50"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-recipe-fifth text-[30px] font-jakarta font-extrabold opacity-0 group-hover:opacity-100">
                  {recipe.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default WelcomePage;
