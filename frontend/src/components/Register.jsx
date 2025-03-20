import { Link } from "react-router";
import UserForm from "./UserForm";

const Register = () => {
  return (
    <div className="register-page">
      <UserForm action="register" />
    </div>
  );
};

export default Register;
