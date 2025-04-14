import { useEffect } from "react";

const ListPagination = ({ filter, setFilter, count }) => {
  const prevPage = () => {
    if (filter.page > 1) {
      setFilter((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const nextPage = () => {
    if (filter.page < Math.ceil(count / filter.limit)) {
      setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  useEffect(() => {
    if (filter.page > Math.floor(count / filter.limit) + 1) {
      setFilter((prev) => ({
        ...prev,
        page: Math.floor(count / filter.limit) + 1,
      }));
    }
  }, [count]);

  return (
    <div className="pagination">
      <button onClick={prevPage}>{"<<"}</button>
      <p>
        Page {filter.page} of {Math.floor(count / filter.limit) + 1}
      </p>
      <button onClick={nextPage}>{">>"}</button>
    </div>
  );
};

export default ListPagination;
