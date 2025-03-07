import { Link } from "react-router";
import UserForm from "./UserForm";

const Register = () => {
  return (
    <div className="register-page">
      <UserForm action="register" />{" "}
      <p>
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
