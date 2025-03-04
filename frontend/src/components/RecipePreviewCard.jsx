import { LuClock4 } from "react-icons/lu";
import { IoPeople } from "react-icons/io5";

const RecipePreviewCard = ({ recipe }) => {
  return (
    <article className="recipe-preview-card">
      <div className="recipe-preview-card__image-container">
        <img
          className="recipe-preview-card__image"
          src={recipe.photo}
          alt={recipe.title}
        />
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
      <hr className="recipe-preview-card__line" />
      <p className="recipe-preview-card__type">{recipe?.type}</p>
    </article>
  );
};

export default RecipePreviewCard;
