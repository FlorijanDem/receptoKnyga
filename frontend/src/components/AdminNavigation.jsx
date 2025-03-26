import { useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import UserContext from "../contexts/UserContext";
import { useForm } from "react-hook-form";

const AdminNavigation = () => {
  const { setAdminFilters } = useContext(AdminFilterContext);
  const { user } = useContext(UserContext);
  const { adminPage, setAdminPage } = useContext(AdminFilterContext);
  const { register, reset } = useForm();
  const navigate = useNavigate();

  const handleRadioChange = (e) => {
    setAdminFilters({
      name: e.target.name,
      value: e.target.value,
    });
    navigate(`${adminPage === "recipes" ? "/" : `/${adminPage}`}`);
  };

  console.log(window.location.pathname);

  useEffect(() => {
    reset();
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    if (user?.role === "admin") {
      setAdminFilters((prev) => {
        return {
          ...prev,
          value: "all",
        };
      });
      navigate(`${adminPage === "recipes" ? "/" : `/${adminPage}`}`);
    }
    console.log(adminPage);
  }, [adminPage]);

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
          {(window.location.pathname === "/" ||
            window.location.pathname === "/users" ||
            window.location.pathname === "/reviews") && (
            <form className="flex justify-around mt-[2rem]">
              <label
                htmlFor="all"
                className="cursor-pointer"
              >
                <input
                  className="cursor-pointer"
                  // onChange={handleRadioChange}
                  type="radio"
                  id="all"
                  {...register(
                    `${adminPage === "users" ? "banned" : "approved"}`,
                    { onChange: (e) => handleRadioChange(e) }
                  )}
                  // name={adminPage === "users" ? "banned" : "approved"}
                  value="all"
                  defaultChecked
                />{" "}
                All {adminPage}
              </label>
              <label
                htmlFor={adminPage === "users" ? "banned" : "approved"}
                className="cursor-pointer"
              >
                <input
                  className="cursor-pointer"
                  // onChange={handleRadioChange}
                  type="radio"
                  id={adminPage === "users" ? "banned" : "approved"}
                  {...register(
                    `${adminPage === "users" ? "banned" : "approved"}`,
                    { onChange: (e) => handleRadioChange(e) }
                  )}
                  // name={adminPage === "users" ? "banned" : "approved"}
                  value="true"
                />{" "}
                {adminPage === "users" ? "Banned" : "Approved"} {adminPage}
              </label>

              <label
                htmlFor={adminPage === "users" ? "unbanned" : "unapproved"}
                className="cursor-pointer"
              >
                <input
                  className="cursor-pointer"
                  // onChange={handleRadioChange}
                  type="radio"
                  id={adminPage === "users" ? "unbanned" : "unapproved"}
                  {...register(
                    `${adminPage === "users" ? "banned" : "approved"}`,
                    { onChange: (e) => handleRadioChange(e) }
                  )}
                  // name={adminPage === "users" ? "banned" : "approved"}
                  value="false"
                />{" "}
                {adminPage === "users" ? "Unbanned" : "Unapproved"} {adminPage}
              </label>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default AdminNavigation;
