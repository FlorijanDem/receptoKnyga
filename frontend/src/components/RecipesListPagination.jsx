const RecipesListPagination = ({ filter, setFilter, recipeCount }) => {
  const prevPage = () => {
    if (filter.page > 1) {
      setFilter((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const nextPage = () => {
    if (filter.page < Math.ceil(recipeCount / filter.limit)) {
      setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className="pagination">
      <button onClick={prevPage}>{"<<"}</button>
      <p>
        Page {filter.page} of {Math.ceil(recipeCount / filter.limit)}
      </p>
      <button onClick={nextPage}>{">>"}</button>
    </div>
  );
};

export default RecipesListPagination;
