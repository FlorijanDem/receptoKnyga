import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { AdminFilterContext } from "../contexts/AdminFilterContext";

const API_URL = import.meta.env.VITE_API_URL;

const UsersList = () => {
  const { user } = useContext(UserContext);
  const { adminFilters } = useContext(AdminFilterContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data: response } = await axios.get(
          `${API_URL}/users?${
            adminFilters.value === "all"
              ? ""
              : `${adminFilters.name}=${adminFilters.value}`
          }`,
          {
            withCredentials: true,
          }
        );

        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [adminFilters]);

  return (
    <>
      <h1>UsersList</h1>
      {users.map((user) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </>
  );
};

export default UsersList;
