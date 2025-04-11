import { createContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [currentQuery, setCurrentQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    product: "",
  });

  return (
    <SearchContext.Provider
      value={{
        currentQuery,
        setCurrentQuery,
        draftQuery,
        setDraftQuery,
        filters,
        setFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
