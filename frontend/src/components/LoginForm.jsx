// import { Link } from "react-router";
// import UserForm from "./UserForm";

// const Login = () => {
//   return (
//     <div className="login-page">
//       <UserForm action="login" />
//       <p>
//         Don't have an account?{" "}
//         <Link to="/register" className="text-blue-600">
//           Register
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
// import { useUserContext } from "../service/UserContextProvider"; //API?
import "../styles/LoginForm.css";
import "@fontsource/plus-jakarta-sans"; // Defaults to weight 400

export const LoginForm = ({ toggleForm }) => {
  //   const userData = useUserContext();
  const [error, setError] = useState("");
  const navigate = useNavigate;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (formData) => {
    try {
      const userId = await apiLoginUser(formData);
      if (userId.error) {
        setError(userId.error);
      } else {
        userData.setUserLoggedIn(userId.id);
        navigate("/");
      }
    } catch (e) {
      setError(e);
    }
  };
  return (
    <div className="box">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="error-text">
          {error && !errors.email && !errors.password && <p>{error}</p>}
        </div>
        <h1 className="heading-login">Login</h1>
        <div className={`input_box ${errors.password ? "error" : ""}`}>
          <p className="email">Email</p>
          <input
            id="email"
            type="email"
            aria-label="Enter your email address"
            autoComplete="on"
            placeholder="Insert your email"
            className="form_text"
            {...register("email", {
              required: "Can't be empty", 
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Email validation pattern
                message: "Invalid email address", // Error message for invalid email
              },
            })}
          />
          {/* Display the "Can't be empty" message if the field is required and empty */}
          {errors.email &&
            errors.email.type === "required" &&
            !errors.email?.message.includes("Invalid email address") && (
              <p className="error_message required_error">
                {errors.email.message}
              </p>
            )}
          {/* Display the invalid email format message if the email is incorrect */}
          {errors.email && errors.email.type === "pattern" && (
            <p className="error_message pattern_error">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className={`input_box ${errors.password ? "error" : ""}`}>
          <p className="password">Password</p>
          <input
            id="password"
            type="password"
            aria-label="Enter your password"
            autoComplete="off"
            placeholder="Insert your password"
            className="form_text"
            {...register("password", {
              required: "Can't be empty",
            })}
          />
          {errors.password && (
            <p className="error_message">{errors.password.message}</p>
          )}
        </div>
        <div>
          <button type={"submit"}>Login</button>
        </div>

        <div className="sing-in">
          <p onClick={toggleForm}>Sing In</p>
        </div>
        <p className="dont-have">Don't have an account?</p>
      </form>
    </div>
  );
};
