import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import UserCard from "./UserCard";
import ListPagination from "./ListPagination";

const API_URL = import.meta.env.VITE_API_URL;

const UsersList = () => {
  const { user } = useContext(UserContext);
  const { adminFilters } = useContext(AdminFilterContext);
  const [filter, setFilter] = useState({ page: 1, limit: 12 });
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    /*************  ✨ Codeium Command ⭐  *************/
    /**
 * Fetches a list of users from the server based on the current filter and admin filters.
 * Updates the users state with the fetched data and sets the count of users.
 * If the current user is not an admin, redirects to the home page.
 *

 * @async
 * @function fetchUsers
 * @returns {Promise<void>} - A promise that resolves when the users are fetched and state is updated.
 */

    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", filter.page);
        params.append("limit", filter.limit);
        if (adminFilters?.value !== "all" && user?.role === "admin") {
          params.append(adminFilters.name, adminFilters.value);
        }

        const { data: response } = await axios.get(
          `${API_URL}/users?${params.toString()}`,
          {
            withCredentials: true,
          }
        );

        setUsers(response.data);
        setCount(response.count);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [adminFilters, filter]);

  return (
    <section className="w-9/12 max-w-[600px] mx-auto py-4">
      <h1 className="text-center text-3xl">Users List</h1>
      <ListPagination filter={filter} setFilter={setFilter} count={count} />
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </section>
  );
};

export default UsersList;
