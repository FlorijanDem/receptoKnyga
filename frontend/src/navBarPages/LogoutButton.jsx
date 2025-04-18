import { useNavigate } from "react-router";
import axios from "axios";
import { useErrorBoundary } from "react-error-boundary";
import LogoutIcon from "../assets/icons/logout.svg";
const API_URL = import.meta.env.VITE_API_URL;

const LogoutButtonStyles =
  "flex items-center justify-start text-jakarta text-recipe-secondary text-[16px] font-medium " +
  "hover:bg-recipe-primary hover:text-recipe-fifth rounded-md transition-colors duration-200 " +
  "w-full h-[56px] px-[1rem] group";
const LogoutIconStyles =
  "mr-[0.75rem] group-hover:filter group-hover:brightness-0 group-hover:invert";

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

  return (
    <div className="pr-[2rem]">
      <p
        onClick={() => handleLogoutClick()}
        className={`${LogoutButtonStyles} ml-[1rem]`}
      >
        <img
          src={LogoutIcon}
          alt="logoutIcon"
          className={`${LogoutIconStyles}`}
        />
        Logout
      </p>
    </div>
  );
};

export default LogoutButton;
