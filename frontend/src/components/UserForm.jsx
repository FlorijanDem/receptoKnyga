import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useErrorBoundary } from "react-error-boundary";
import UserContext from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const UserForm = ({ action }) => {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const { showBoundary } = useErrorBoundary();

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

      console.log(response);

      setUser(response.user);
      console.log(user);
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
  }, [action]);

  return (
    <>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            {...register("email", {
              id: "email",
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        {action === "register" && (
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              {...register("username", {
                id: "username",
                required: "Username is required",
              })}
            />
            {errors.username && <p>{errors.username.message}</p>}
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
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {action === "register" && (
          <div className="input-container">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              type="password"
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default UserForm;
