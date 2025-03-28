import { useContext, useEffect, useState } from "react";
import FavList from "../components/FavList";
import UserContext from "../contexts/UserContext";
const API_URL = import.meta.env.VITE_API_URL;

const Favourite = () => {
  const { user } = useContext(UserContext);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error("Please log in to view favorites.");
      }
      setUserId(user.id);
      setError(null);
    } catch (err) {
      setError("Failed to fetch user data. Please ensure you are logged in.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
