import { useEffect } from "react";
import { useLocation } from "react-router";

const UsersList = () => {
  const location = useLocation();
  console.log("location.state", location.state);

  useEffect(() => {
    console.log(location.state);
  }, [location.state]);

  return <h1>UsersList</h1>;
};

export default UsersList;
