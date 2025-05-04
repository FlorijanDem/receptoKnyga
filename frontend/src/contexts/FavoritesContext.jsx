// src/contexts/FavoritesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FavoritesContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(new Set());

  const fetchFavorites = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/favorites/${userId}`, {
        withCredentials: true,
      });
      setFavorites(new Set(response.data.data));
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const addFavorite = (recipeId) => {
    setFavorites((prev) => new Set(prev).add(recipeId));
  };

  const removeFavorite = (recipeId) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.delete(recipeId);
      return newSet;
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, fetchFavorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export { FavoritesContext };
