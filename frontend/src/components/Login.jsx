import { Link } from "react-router";
import UserForm from "./UserForm";

const Login = () => {
  return (
    <div className="login-page">
      <UserForm action="login" />
    </div>
  );
};

export default Login;
