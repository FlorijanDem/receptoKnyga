import RecipePreviewCard from "./RecipePreviewCard";

const RecipesList = ({ recipes }) => {
  return (
    <section>
      <h1>Recipes List</h1>
      {recipes?.length === 0 && <p>No recipes found</p>}
      {recipes.map((recipe) => (
        <RecipePreviewCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
};

export default RecipesList;
