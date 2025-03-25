import { useEffect, useContext } from "react";
import { NavLink } from "react-router";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import UserContext from "../contexts/UserContext";

const AdminNavigation = () => {
  const { setAdminFilters } = useContext(AdminFilterContext);
  const { user } = useContext(UserContext);
  const { adminPage, setAdminPage } = useContext(AdminFilterContext);

  const handleRadioChange = (e) => {
    setAdminFilters({
      name: e.target.name,
      value: e.target.value,
    });
  };

  useEffect(() => {
    if (user?.role === "admin") {
      setAdminFilters((prev) => {
        return {
          ...prev,
          value: "all",
        };
      });
    }
  }, []);

  //   console.log("adminFilter", adminFilters);

  return (
    <>
      {user?.role === "admin" && (
        <div className="admin-nav">
          <div className="flex justify-around mt-[2rem]">
            <NavLink
              onClick={() => setAdminPage("recipes")}
              className={({ isActive }) => (isActive ? "underline" : "")}
              to="/"
              //   state={adminFilter}
            >
              Recipes
            </NavLink>
            <NavLink
              onClick={() => setAdminPage("users")}
              className={({ isActive }) => (isActive ? "underline" : "")}
              to="/users"
              //   state={adminFilter}
            >
              Users
            </NavLink>
            <NavLink
              onClick={() => setAdminPage("reviews")}
              className={({ isActive }) => (isActive ? "underline" : "")}
              to="/reviews"
              //   state={adminFilter}
            >
              Reviews
            </NavLink>
          </div>
          <form className="flex justify-around mt-[2rem]">
            <label htmlFor="all">
              <input
                onChange={handleRadioChange}
                type="radio"
                id="all"
                name={adminPage === "users" ? "banned" : "approved"}
                value="all"
                defaultChecked
              />{" "}
              All {adminPage}
            </label>
            <label htmlFor={adminPage === "users" ? "banned" : "approved"}>
              <input
                onChange={handleRadioChange}
                type="radio"
                id={adminPage === "users" ? "banned" : "approved"}
                name={adminPage === "users" ? "banned" : "approved"}
                value="true"
              />{" "}
              {adminPage === "users" ? "Banned" : "Approved"} {adminPage}
            </label>
            <label htmlFor={adminPage === "users" ? "unbanned" : "unapproved"}>
              <input
                onChange={handleRadioChange}
                type="radio"
                id={adminPage === "users" ? "unbanned" : "unapproved"}
                name={adminPage === "users" ? "banned" : "approved"}
                value="false"
              />{" "}
              {adminPage === "users" ? "Unbanned" : "Unapproved"} {adminPage}
            </label>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminNavigation;
