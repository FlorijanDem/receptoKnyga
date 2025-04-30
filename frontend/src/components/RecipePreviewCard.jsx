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
        const payload = { recipeId: String(recipe.id) };
        await axios.post(`${API_URL}/favorites`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Axios Error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
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
          className="absolute top-[26px] right-[26px] hover:scale-110 transition-transform duration-200 bg-[var(--color-bookmark-bg)]  rounded-full p-2"
          onClick={handleFavoriteClick}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-2xl " />
          ) : (
            <FaRegHeart className="text-gray-100 text-2xl " />
          )}
        </button>
      </div>
      <div className="recipe-preview-card__info">
        <span>{recipe?.calories} Cal</span>
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
      {!recipe.approved && (
        <p className="recipe-preview-card__approved">Not approved</p>
      )}
    </article>
  );
};

export default RecipePreviewCard;
