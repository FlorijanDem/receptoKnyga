import { LuClock4 } from "react-icons/lu";
import { IoPeople } from "react-icons/io5";

const RecipePreviewCard = ({ recipe }) => {
  return (
    <article className="recipe-preview-card w-max">
      <img
        className="recipe-preview-card__image"
        src={recipe.photo}
        alt={recipe.title}
      />
      <div className="recipe-preview-card__info flex gap-4">
        <span className="flex items-center gap-1">
          {recipe?.calories || 400} Cal
        </span>
        <span className="flex items-center gap-1">
          <LuClock4 /> {recipe?.preparation_time} Min
        </span>
        <span className="flex items-center gap-1">
          <IoPeople /> {recipe?.servings} People
        </span>
      </div>
      <h2 className="recipe-preview-card__title">{recipe?.title}</h2>
      <hr />
      <p>{recipe?.type}</p>
    </article>
  );
};

export default RecipePreviewCard;
