import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { getSearchDistance } from '../api/UserPreferencesService';


const SearchPreferencesContext = createContext();

export const SearchPreferencesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [searchDistance, setSearchDistance] = useState(10); // Default distance

  useEffect(() => {
    if (!user) {
      // User data not available yet, return
      return;
    }

    const initializeSearchDistance = async () => {
      const userId = user._id;
      try {
        const distance = await getSearchDistance(userId);
        if (distance !== undefined) {
          setSearchDistance(distance);
        }
      } catch (error) {
        console.error('Failed to fetch search distance:', error);
      }
    };

    initializeSearchDistance();
  }, [user]);

  return (
    <SearchPreferencesContext.Provider value={{ searchDistance, setSearchDistance }}>
      {children}
    </SearchPreferencesContext.Provider>
  );
};

export const useSearchPreferences = () => {
  return useContext(SearchPreferencesContext);
};
