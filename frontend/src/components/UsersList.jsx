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
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

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

    const fetchStats = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/users/stats`, {
          withCredentials: true,
        });

        setStats(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStats();
  }, [adminFilters, filter]);

  return (
    <section className="w-9/12 max-w-[1200px] mx-auto py-4">
      <h1 className="text-center text-3xl">Users List</h1>
      <div>
        <p>Total users: {stats.reduce((acc, s) => acc + +s?.count, 0)}</p>
        <p>Banned users: {stats.find((s) => s.banned)?.count || 0}</p>
        {/* <p>Unapproved recipes: {stats.find((s) => !s.approved).count}</p> */}
      </div>
      <ListPagination filter={filter} setFilter={setFilter} count={count} />
      <div className="users-list">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <ListPagination filter={filter} setFilter={setFilter} count={count} />
    </section>
  );
};

export default UsersList;
