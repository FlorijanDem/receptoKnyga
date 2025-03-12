import React, { useContext } from "react";
import SearchContext from "../contexts/SearchContext";
import { validateSearchQuery } from "../utils/validation/searchValidation";

const SearchBar = () => {
  const { draftQuery, setDraftQuery, setCurrentQuery } = useContext(SearchContext);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Validate search query first
    const validation = validateSearchQuery(draftQuery);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    // Update search state
    setCurrentQuery(draftQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center bg-white border border-[#C3D4E9] rounded-full shadow-sm focus-within:ring-2 focus-within:ring-recipe-primary
      w-full h-[44px]"
    >
      <button type="button" className="p-4 text-gray-500" onClick={handleSearch}>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </button>
      <input
        type="text"
        placeholder="Search recipes..."
        className="w-full px-2 py-2 text-gray-700 bg-transparent border-none focus:outline-none"
        value={draftQuery}
        onChange={(e) => setDraftQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />

    </form>
  );
};

export default SearchBar;
