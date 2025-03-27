import { Link } from "react-router";
import UserForm from "./UserForm";

const Login = () => {
  return (
    <div className="login-page">
      <UserForm action="login" />
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
      <p>
        Forgot your password?{" "}
        <Link to="/forgot-password" className="text-blue-600">
          Reset Password
        </Link>
      </p>
    </div>
  );
};

export default Login;
