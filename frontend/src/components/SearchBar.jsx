import React from "react";

const SearchBar = () => {
  return (
    <div className={`flex justify-center w-full`}>
      <div
        className="flex items-center bg-white border border-[#C3D4E9] rounded-full shadow-sm focus-within:ring-2 focus-within:ring-recipe-primary
      w-full  h-[44px]"
      >
        <button className="p-2 text-gray-500">
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
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2.35a7.5 7.5 0 010 14.3z"
            ></path>
          </svg>
        </button>
        <input
          type="text"
          className="w-full px-4 py-2 text-gray-700 focus:outline-none"
          placeholder="Search something..."
        />
      </div>
    </div>
  );
};

export default SearchBar;
