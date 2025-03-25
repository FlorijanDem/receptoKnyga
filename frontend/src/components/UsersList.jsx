<<<<<<< HEAD
import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import UserCard from "./UserCard";

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
    <section className="w-9/12 max-w-[600px] mx-auto py-4">
      <h1 className="text-center text-3xl">Users List</h1>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </section>
  );
=======
import { useEffect } from "react";
import { useLocation } from "react-router";

const UsersList = () => {
  const location = useLocation();
  console.log("location.state", location.state);

  useEffect(() => {
    console.log(location.state);
  }, [location.state]);

  return <h1>UsersList</h1>;
>>>>>>> 05b6ea2 (Add admin navigation)
};

export default UsersList;
