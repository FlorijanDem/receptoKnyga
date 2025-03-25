import { useEffect, useContext } from "react";
<<<<<<< HEAD
import { NavLink, useNavigate } from "react-router";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import UserContext from "../contexts/UserContext";
import { useForm } from "react-hook-form";
=======
import { NavLink } from "react-router";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import UserContext from "../contexts/UserContext";
>>>>>>> 68610e4 (Add admin navigation)

const AdminNavigation = () => {
  const { setAdminFilters } = useContext(AdminFilterContext);
  const { user } = useContext(UserContext);
  const { adminPage, setAdminPage } = useContext(AdminFilterContext);
<<<<<<< HEAD
  const { register, reset } = useForm();
  const navigate = useNavigate();
=======
>>>>>>> 68610e4 (Add admin navigation)

  const handleRadioChange = (e) => {
    setAdminFilters({
      name: e.target.name,
      value: e.target.value,
    });
<<<<<<< HEAD
    navigate(`${adminPage === "recipes" ? "/" : `/${adminPage}`}`);
  };

  useEffect(() => {
    reset();
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
=======
  };

  useEffect(() => {
>>>>>>> 68610e4 (Add admin navigation)
    if (user?.role === "admin") {
      setAdminFilters((prev) => {
        return {
          ...prev,
          value: "all",
        };
      });
<<<<<<< HEAD
      navigate(`${adminPage === "recipes" ? "/" : `/${adminPage}`}`);
    }
    console.log(adminPage);
  }, [adminPage]);
=======
    }
  }, []);
>>>>>>> 68610e4 (Add admin navigation)

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
<<<<<<< HEAD

=======
>>>>>>> 68610e4 (Add admin navigation)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 68610e4 (Add admin navigation)
        </div>
      )}
    </>
  );
};

export default AdminNavigation;
