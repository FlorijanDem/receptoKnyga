import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { useErrorBoundary } from "react-error-boundary";
import UserContext from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const UserForm = ({ action, recipeId }) => {
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { data: response } = await axios.post(
        `${API_URL}/auth/${action}`,
        data,
        {
          withCredentials: true,
        }
      );

      setUser(response.user);
      navigate(`/recipe/${recipeId}`);
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
  };

  useEffect(() => {
    reset();
    setError(null);
    scrollTo({ top: 0, behavior: "smooth" });
  }, [action]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        {error && <p className="error">{error}</p>}
        {action === "register" ? <h1>Register</h1> : <h1>Login</h1>}
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            placeholder="Insert your email"
          />
          {errors.email && (
            <p className="form-input-error">{errors.email.message}</p>
          )}
        </div>

        {action === "register" && (
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              {...register("username", {
                required: "Username is required",
              })}
              placeholder="Insert your username"
            />
            {errors.username && (
              <p className="form-input-error">{errors.username.message}</p>
            )}
          </div>
        )}

        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            placeholder="Insert your password"
          />
          {errors.password && (
            <p className="form-input-error">{errors.password.message}</p>
          )}
        </div>

        {action === "register" && (
          <div className="input-container">
            <label htmlFor="password-confirm">Confirm Password</label>
            <input
              id="password-confirm"
              {...register("password-confirm", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              type="password"
              placeholder="Insert your password again"
            />
            {errors["password-confirm"] && (
              <p className="form-input-error">
                {errors["password-confirm"].message}
              </p>
            )}
          </div>
        )}

        <button type="submit">
          {action === "register" ? "Register" : "Log in"}
        </button>

        {action === "register" ? (
          <p className="form-link">
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
            Already have an account?
          </p>
        ) : (
          <p className="form-link">
            <Link to="/register" className="text-blue-600">
              Register
            </Link>
            Don't have an account?
          </p>
        )}
      </form>
    </>
  );
};

export default UserForm;
