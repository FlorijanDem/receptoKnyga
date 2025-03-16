// import { Link } from "react-router";
// import UserForm from "./UserForm";

// const Register = () => {
//   return (
//     <div className="register-page">
//       <UserForm action="register" />{" "}
//       <p>
//         Already have an account?{" "}
//         <Link to="/login" className="text-blue-600">
//           Login
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default Register;

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getByEmail } from '../api/get'; API
// import { addUser } from '../api/post'; API
// import { generateHash } from "../utils/passwordHash";

import "../styles/SingInForm.css";
import "@fontsource/plus-jakarta-sans";

const SignInForm = ({ toggleForm }) => {
  const navigate = useNavigate;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();
  const [users, setUsers] = useState([]);
  const [error, setErrorMessage] = useState("");

  const checkIfEmailExists = async (data) => {
    const email = data.email;
    const isUserExist = await getByEmail(email);
    if (isUserExist && isUserExist.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const checkIfPasswordsMatch = (data) => {
    return data.password === data.repeatPassword;
  };

  const formSubmitHandler = async (data) => {
    try {
      const isEmailExist = await checkIfEmailExists(data);
      if (isEmailExist) {
        setError("email", {
          type: "manual",
          message: "This email already exists",
        });
        setErrorMessage("This email already exists");
      } else if (!checkIfPasswordsMatch(data)) {
        setError("repeatPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        setErrorMessage("Passwords do not match");
      } else {
        const { repeatPassword, ...userData } = data;
        const hashedPassword = await generateHash(data.password);
        const newUser = {
          ...userData,
          password: hashedPassword,
          role: "USER",
          username: data.email,
          avatar: "",
        };
        await addUser(newUser);
        setUsers((prev) => [...prev, newUser]);
        reset();
        setErrorMessage("");
        toast.success("You have successfully signed up. Please login!");
        // onLogin();
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div className="Box">
        <section className="section">
          <h1 className="heading">Sign in</h1>
          <form onSubmit={handleSubmit(formSubmitHandler)} noValidate>
            <div className="input-container-email">
              <p className="Email">Email</p>
              <input
                type="email"
                aria-label="Enter your email address"
                placeholder="Insert your email"
                className={`input-field ${
                  errors.email ? "input-error" : "border-lightBlue"
                }`}
                {...register("email", {
                  required: "Can't be empty",
                  pattern: {
                    value:
                      /^(?=.{1,254}$)(?=.{1,64}@)(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              <p
                className={`error-message ${
                  errors.email?.message.includes("empty")
                    ? "error-position"
                    : "error-text"
                } `}
              >
                {errors.email?.message}
              </p>
            </div>

            <div className="input-container">
              <p className="password">Password</p>
              <input
                type="password"
                aria-label="Enter password"
                placeholder="Insert your password"
                className={`input-field ${
                  errors.password ? "input-error" : "input-normal"
                }`}
                {...register("password", {
                  required: "Can't be empty",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value:
                      /^(?!.*<.*?>)(?!.*javascript:)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message:
                      "Password must contain both uppercase and lowercase letters",
                  },
                  validate: (value) => {
                    const zalgoRegex =
                      /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF]/;
                    if (zalgoRegex.test(value)) {
                      return "Password cannot contain Zalgo text";
                    }
                    return true;
                  },
                })}
              />
              <p
                className={`error-message ${
                  errors.password?.message.includes("empty")
                    ? "error-position"
                    : "error-text"
                }`}
              >
                {errors.password?.message}
              </p>
            </div>

            <div className="input-container">
              <p className="re-password">Re enter password</p>
              <input
                type="password"
                aria-label="Repeat your password"
                placeholder="Re enter the password"
                className={`input-field ${
                  errors.repeatPassword ? "input-error" : "input-normal"
                }`}
                {...register("repeatPassword", {
                  required: "Can't be empty",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value:
                      /^(?!.*<.*?>)(?!.*javascript:)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message:
                      "Password must contain both uppercase and lowercase letters",
                  },
                })}
              />

              <p
                className={`error-message ${
                  errors.repeatPassword?.message.includes("empty")
                    ? "error-position"
                    : "error-text"
                }`}
              >
                {errors.repeatPassword?.message}
              </p>
            </div>

            <button className="button">Sing in</button>
          </form>

          <div className="login">
            <p onClick={toggleForm}>Login</p>
            <span>
              <p className="already">Already have an account?</p>
            </span>
          </div>
        </section>
      </div>
    </>
  );
};

export default SignInForm;
