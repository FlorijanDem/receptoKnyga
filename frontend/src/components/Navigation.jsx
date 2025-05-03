import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router";

import NavProfileIcon from "../assets/icons/Profil.svg";
import NavMenuIcon from "../assets/icons/Menu.svg";
import NavFilterIcon from "../assets/icons/Filter.svg";

import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SearchContext from "../contexts/SearchContext";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import UserContext from "../contexts/UserContext";
import FilterForm from "./FilterForm";
import AdminNavigation from "./AdminNavigation";

const icons = [
  {
    src: NavProfileIcon,
    alt: "profile Icon",
    pagename: "Profile",
    path: "/profile",
  },
];

const Navigation = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);

  const { setDraftQuery, setCurrentQuery, setFilters } = useContext(SearchContext);
  const { setAdminFilters, setAdminPage } = useContext(AdminFilterContext);
  const { user } = useContext(UserContext);

  const sidebarRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      isSidebarOpen
    ) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleFilterForm = () => {
    setIsFilterFormOpen(!isFilterFormOpen);
    if (isFilterFormOpen) {
      setFilters({
        type: "",
        product: "",
      });
    }
  };

  const handleLogoClick = () => {
    setDraftQuery("");
    setCurrentQuery("");
    setFilters({
      type: "",
      product: "",
    });
    if (user?.role === "admin") {
      setAdminPage("recipes");
      setAdminFilters({
        name: "approved",
        value: "all",
      });
    }
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-main">
          <div className="nav-logo-container">
            <Link to="/" onClick={handleLogoClick}>
              <h1 className="nav-logo">Calibrium</h1>
            </Link>
            <div className="nav-mobile-icons">
              <button onClick={toggleSidebar}>
                <img src={NavMenuIcon} alt="menu Icon" width="24" height="24" />
              </button>
              {icons.map((icon, index) => (
                <Link to={icon.path} key={index} className="nav-icon">
                  <img src={icon.src} alt={icon.alt} width="44" height="44" />
                </Link>
              ))}
            </div>
          </div>

          <div className="nav-search-container">
            <SearchBar />
            <button
              className={`nav-filter-button ${isFilterFormOpen ? 'nav-filter-button--active' : ''}`}
              onClick={toggleFilterForm}
            >
              <img
                src={NavFilterIcon}
                alt="Filter icon"
                className="w-12 h-12"
              />
            </button>
          </div>

          <div className="nav-desktop-icons">
            <button className="nav-icon" onClick={toggleSidebar}>
              <img src={NavMenuIcon} alt="menu Icon" width="24" height="24" />
            </button>
            {icons.map((icon, index) => (
              <Link to={icon.path} key={index} className="nav-icon">
                <img src={icon.src} alt={icon.alt} width="44" height="44" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div ref={sidebarRef}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="relative">
        <FilterForm isOpen={isFilterFormOpen} onClose={toggleFilterForm} />
      </div>

      {isFilterFormOpen && <div className="nav-sidebar-spacer"></div>}
      <AdminNavigation />
    </nav>
  );
};

export default Navigation;