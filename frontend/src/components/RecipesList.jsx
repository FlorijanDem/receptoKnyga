import RecipePreviewCard from "./RecipePreviewCard";

const RecipesList = ({ recipes }) => {
  return (
    <section className="recipes-list-container py-10 bg-gray-200 ">
      <h1>Recipes List</h1>
      <div className="recipes-list w-max mx-auto flex flex-col gap-5 items-center md:grid md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
        {recipes?.length === 0 && <p>No recipes found</p>}
        {recipes.map((recipe) => (
          <RecipePreviewCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};

export default RecipesList;
