import { useContext, useEffect, useState } from "react";
import FavList from "../components/FavList";
import UserContext from "../contexts/UserContext"; // Import UserContext

const Favourite = () => {
  const { user } = useContext(UserContext); // Get user from context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is available from context
    if (user) {
      setLoading(false);
    } else {
      setError("User data not found. Please ensure you are logged in.");
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
      <FavList userId={user.id} /> {/* Use user.id from context */}
    </>
  );
};

export default Favourite;
