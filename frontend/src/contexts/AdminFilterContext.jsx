import { createContext, useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";

const AdminFilterContext = createContext();

const AdminFilterContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [adminPage, setAdminPage] = useState("");
  const [adminFilters, setAdminFilters] = useState({
    name: "approved",
    value: "true",
  });

  useEffect(() => {
    if (user?.role !== "admin") return;
    setAdminFilters({
      name: adminPage === "users" ? "banned" : "approved",
      value: "all",
    });
  }, [adminPage]);

  return (
    <AdminFilterContext.Provider
      value={{ adminFilters, setAdminFilters, adminPage, setAdminPage }}
    >
      {children}
    </AdminFilterContext.Provider>
  );
};

export { AdminFilterContext, AdminFilterContextProvider };
