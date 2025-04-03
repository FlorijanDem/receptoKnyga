import { Link, useLocation } from "react-router";
import UserForm from "./UserForm";

const Login = () => {
  const location = useLocation();
  const recipeId = location.state?.recipeId;
  console.log(recipeId);

  return (
    <div className="login-page">
      <UserForm action="login" recipeId={recipeId} />
    </div>
  );
};

export default Login;
