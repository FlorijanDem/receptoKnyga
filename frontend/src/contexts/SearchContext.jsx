import { createContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [currentQuery, setCurrentQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");

  return (
    <SearchContext.Provider 
      value={{ 
        currentQuery, 
        setCurrentQuery,
        draftQuery,
        setDraftQuery
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
