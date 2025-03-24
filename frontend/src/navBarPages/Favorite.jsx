import axios from "axios";
import { useEffect, useState } from "react";
import FavList from "../components/FavList";

const API_URL = import.meta.env.VITE_API_URL;

const Favourite = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true, // Ensures cookies/session data is sent
      });
      const { id } = response.data.user;
      setUserId(id);
      setError(null);
    } catch (err) {
      setError("Failed to fetch user data. Please ensure you are logged in.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <FavList userId={userId} />
    </>
  );
};

export default Favourite;
