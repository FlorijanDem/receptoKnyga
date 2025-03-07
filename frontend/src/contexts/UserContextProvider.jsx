import axios from "axios";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import UserContext from "./UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });

        setUser(response.data);
        setError(null);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setError(error.response.data.message);
          } else if (error.request) {
            setError("Something went wrong. Please try again later.");
          } else {
            setError("Network error. Please check your internet connection.");
          }
        } else {
          showBoundary(error);
        }
      }
    };
    fetchUser();
  }, []);
  return (
    <>
      {!loading && !error && (
        <UserContext.Provider value={{ user, setUser }}>
          {children}
        </UserContext.Provider>
      )}
    </>
  );
};

export default UserContextProvider;
