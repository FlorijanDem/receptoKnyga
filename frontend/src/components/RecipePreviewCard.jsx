import { LuClock4 } from "react-icons/lu";
import { IoPeople } from "react-icons/io5";

const RecipePreviewCard = ({ recipe }) => {
  return (
    <article className="recipe-preview-card w-[300px]  text-gray-600 rounded-lg bg-white overflow-hidden">
      <div className="recipe-preview-card__image-container w-full h-[200px]">
        <img
          className="recipe-preview-card__image object-cover w-full"
          src={recipe.photo}
          alt={recipe.title}
        />
      </div>
      <div className="recipe-preview-card__info flex gap-4 mt-2 px-4">
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
      <h2 className="recipe-preview-card__title text-2xl text-gray-800 font-bold mb-2 px-4">
        {recipe?.title}
      </h2>
      <hr className="recipe-preview-card__line mx-4" />
      <p className="recipe-preview-card__type mb-3 px-4">{recipe?.type}</p>
    </article>
  );
};

export default RecipePreviewCard;
