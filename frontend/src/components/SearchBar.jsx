import React, { useContext, useEffect } from "react";
import SearchContext from "../contexts/SearchContext";
import {
  validateSearchQuery,
  MIN_SEARCH_LENGTH,
} from "../utils/validation/searchValidation";

const SearchBar = () => {
  const { draftQuery, setDraftQuery, setCurrentQuery } =
    useContext(SearchContext);

  // Naujas useEffect, kuris reaguoja į draftQuery pasikeitimus
  useEffect(() => {
    // Debounce funkcija, kad sumažintume užklausų skaičių
    const debounceTimeout = setTimeout(() => {
      if (draftQuery.trim().length >= MIN_SEARCH_LENGTH) {
        // Validate search query first
        const validation = validateSearchQuery(draftQuery);
        if (validation.isValid) {
          // Update search state
          setCurrentQuery(draftQuery);
        }
      }
    }, 300); // 300ms debounce laikas

    // Išvalyti timeout, kai komponentas atnaujinamas
    return () => clearTimeout(debounceTimeout);
  }, [draftQuery, setCurrentQuery]);

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

  // Funkcija, kuri išvalo paieškos lauką ir rezultatus
  const handleClearSearch = () => {
    setDraftQuery("");
    setCurrentQuery("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center bg-white border border-[#C3D4E9] rounded-full shadow-sm focus-within:ring-2 focus-within:ring-recipe-primary
      w-full h-[44px]"
    >
      <button
        type="button"
        className="p-4 text-gray-500"
        onClick={handleSearch}
        arial-label="Search"
        title="Search"
      >
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
      {draftQuery && (
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700"
          onClick={handleClearSearch}
          aria-label="Clear search"
        >
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchBar;
