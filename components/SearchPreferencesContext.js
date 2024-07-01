import React, { createContext, useState, useContext } from 'react';

const SearchPreferencesContext = createContext();

export const SearchPreferencesProvider = ({ children }) => {
  const [searchDistance, setSearchDistance] = useState(10); // Default distance

  return (
    <SearchPreferencesContext.Provider value={{ searchDistance, setSearchDistance }}>
      {children}
    </SearchPreferencesContext.Provider>
  );
};

export const useSearchPreferences = () => {
  return useContext(SearchPreferencesContext);
};
