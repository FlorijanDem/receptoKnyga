import { useNavigate } from "react-router";
import axios from "axios";
import { useErrorBoundary } from "react-error-boundary";
const API_URL = import.meta.env.VITE_API_URL;

const LogoutButton = ({ setError }) => {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const handleLogoutClick = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/");
    } catch (error) {
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
    navigate(0);
  };
  return <button className="bg-red-300 p-2 rounded-md hover:bg-red-500" onClick={() => handleLogoutClick()}>Logout</button>;
};

export default LogoutButton;
