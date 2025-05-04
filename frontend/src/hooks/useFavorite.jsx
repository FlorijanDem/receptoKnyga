import { useState, useEffect } from "react";
import axios from "axios";
import { useErrorBoundary } from "react-error-boundary";
import { useFavorites } from "../contexts/FavoritesContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useFavorite = (recipeId, initialFavorite = false) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(
    favorites.has(recipeId) || initialFavorite
  );
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  // Sync isFavorite with favorites Set whenever it changes
  useEffect(() => {
    setIsFavorite(favorites.has(recipeId));
  }, [favorites, recipeId]);

  const toggleFavorite = async () => {
    const previousFavorite = isFavorite;
    setIsFavorite(!isFavorite);
    if (!previousFavorite) {
      addFavorite(recipeId);
    } else {
      removeFavorite(recipeId);
    }
    setError(null);

    try {
      if (previousFavorite) {
        await axios.delete(`${API_URL}/favorites/${recipeId}`, {
          withCredentials: true,
        });
      } else {
        const payload = { recipeId: String(recipeId) };
        await axios.post(`${API_URL}/favorites`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      setIsFavorite(previousFavorite);
      if (previousFavorite) {
        addFavorite(recipeId);
      } else {
        removeFavorite(recipeId);
      }
      console.error("Axios Error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      setError("Failed to update favorite status. Please try again.");
      showBoundary(error);
    }
  };

  return { isFavorite, toggleFavorite, error };
};
