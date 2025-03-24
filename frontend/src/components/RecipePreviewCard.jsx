import { LuClock4 } from "react-icons/lu";
import { IoPeople } from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";

const API_URL = import.meta.env.VITE_API_URL;

const RecipePreviewCard = ({ recipe, showUser = false }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false);
  const { showBoundary } = useErrorBoundary();

  const handleImageClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/favorites/${recipe.id}`, {
          withCredentials: true,
        });
        setIsFavorite(false);
      } else {
        await axios.post(
          `${API_URL}/favorites`,
          { recipeId: recipe.id },
          { withCredentials: true }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      showBoundary(error);
    }
  };

  return (
    <article className="recipe-preview-card">
      <div
        className="recipe-preview-card__image-container relative"
        onClick={() => handleImageClick(recipe)}
      >
        <img
          className="recipe-preview-card__image w-full h-48 object-cover"
          src={recipe.photo || null}
          alt={recipe.title}
        />
        <button
          className="absolute top-[26px] right-[26px] hover:scale-110 transition-transform duration-200"
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-2xl" />
          ) : (
            <FaRegHeart className="text-gray-500 text-2xl" />
          )}
        </button>
      </div>
      <div className="recipe-preview-card__info">
        <span>{recipe?.calories || 400} Cal</span>
        <span>
          <LuClock4 /> {recipe?.preparation_time} Min
        </span>
        <span>
          <IoPeople /> {recipe?.servings} People
        </span>
      </div>
      <h2 className="recipe-preview-card__title">{recipe?.title}</h2>
      {showUser && (
        <p className="recipe-preview-card__user">
          Favorited by User {recipe.userId}
        </p>
      )}
      <hr className="recipe-preview-card__line" />
      <p className="recipe-preview-card__type">{recipe?.type}</p>
    </article>
  );
};

export default RecipePreviewCard;
