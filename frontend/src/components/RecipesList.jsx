import RecipePreviewCard from "./RecipePreviewCard";

const RecipesList = ({ recipes }) => {
  return (
    <section className="recipes-list-container">
      <h1>Recipes List</h1>
      <div className="recipes-list">
        {recipes?.length === 0 && <p>No recipes found</p>}
        {recipes.map((recipe) => (
          <RecipePreviewCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};

export default RecipesList;
