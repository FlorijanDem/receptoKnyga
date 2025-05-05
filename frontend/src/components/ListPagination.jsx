import { useEffect } from "react";

const ListPagination = ({ filter, setFilter, count }) => {
  const totalPages = Math.floor(count / filter.limit) + 1;

  const goToPage = (page) => setFilter((prev) => ({ ...prev, page }));
  const goFirst = () => goToPage(1);
  const goPrev = () => filter.page > 1 && goToPage(filter.page - 1);
  const goNext = () => filter.page < totalPages && goToPage(filter.page + 1);
  const goLast = () => goToPage(totalPages);

  useEffect(() => {
    if (filter.page > totalPages) {
      setFilter((prev) => ({ ...prev, page: totalPages }));
    }
  }, [count]);

  return (
    <div className="flex justify-center mb-2">
      <div className="flex items-center gap-3 p-3 rounded-lg">
        {/* First page */}
        <button
          onClick={goFirst}
          disabled={filter.page === 1}
          className="w-11 h-11 flex items-center justify-center border-[2px] rounded-md text-black transition-colors duration-150 disabled:opacity-30 hover:bg-gray-200"
        >
          «
        </button>

        {/* Previous page */}
        <button
          onClick={goPrev}
          disabled={filter.page === 1}
          className="w-11 h-11 flex items-center justify-center border-[2px] rounded-md transition-colors duration-150 disabled:opacity-30 hover:bg-gray-200"
        >
          ‹
        </button>

        {/* Page numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          const isActive = filter.page === pageNum;

          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`w-11 h-11 flex items-center justify-center border-[2px] rounded-md font-medium text-base transition-colors duration-150 ${
                isActive
                  ? "bg-recipe-primary text-white"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next page */}
        <button
          onClick={goNext}
          disabled={filter.page === totalPages}
          className="w-11 h-11 flex items-center justify-center border-[2px] rounded-md transition-colors duration-150 disabled:opacity-30 hover:bg-gray-200"
        >
          ›
        </button>

        {/* Last page */}
        <button
          onClick={goLast}
          disabled={filter.page === totalPages}
          className="w-11 h-11 flex items-center justify-center border-[2px] rounded-md text-black transition-colors duration-150 disabled:opacity-30 hover:bg-gray-200"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default ListPagination;
