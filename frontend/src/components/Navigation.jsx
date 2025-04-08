import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router";
import NavLikeIcon from "../assets/icons/Like.svg";
import NavSettingIcon from "../assets/icons/Settings.svg";
import NavCartIcon from "../assets/icons/Cart.svg";
import NavProfileIcon from "../assets/icons/Profil.svg";
import NavMenuIcon from "../assets/icons/Menu.svg";
import NavFilterIcon from "../assets/icons/Filter.svg";
import NavAddRecipeIcon from "../assets/icons/AddRecipe.svg";

import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SearchContext from "../contexts/SearchContext";
import FilterForm from "./FilterForm";

const icons = [
  {
    src: NavAddRecipeIcon,
    alt: "add recipe Icon",
    pagename: "AddRecipe",
    path: "/addRecipe",
  },
  { src: NavLikeIcon, alt: "like Icon", pagename: "Like", path: "/favourite" },
  {
    src: NavSettingIcon,
    alt: "setting Icon",
    pagename: "Settings",
    path: "/settings",
  },
  {
    src: NavCartIcon,
    alt: "cart Icon",
    pagename: "Cart",
    path: "/shoppingList",
  },
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
  const { setDraftQuery, setCurrentQuery, setFilters } =
    useContext(SearchContext);

  const sidebarRef = useRef(null); // Ref to track the sidebar element

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Function to handle clicks outside the sidebar
  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      isSidebarOpen
    ) {
      setSidebarOpen(false); // Close the sidebar
    }
  };

  // Add event listener for clicks outside the sidebar
  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Function to handle filter form open/close
  const toggleFilterForm = () => {
    setIsFilterFormOpen(!isFilterFormOpen);
    if (isFilterFormOpen) {
      setFilters({
        type: "",
        product: "",
      });
    }
  };

  // Function to clear search field and results
  const handleLogoClick = () => {
    setDraftQuery("");
    setCurrentQuery("");
    setFilters({
      type: "",
      product: "",
    });
  };

  const iconStyle =
    "mx-[0.625rem] transition-transform duration-300 hover:scale-110 active:scale-90";

  return (
    <nav className="relative">
      <div className="flex flex-col md:flex-row items-center mx-[1.563rem] mt-[2rem] mb-[2rem]">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link to="/" onClick={handleLogoClick}>
            <h1 className="font-jakarta text-recipe-primary font-bold tracking-[-1px] text-[24px] md:text-[32px] xl:text-[32px]">
              Calibrium
            </h1>
          </Link>
          <button className="md:hidden" onClick={toggleSidebar}>
            <img src={NavMenuIcon} alt="menu Icon" width="24" height="24" />
          </button>
        </div>

        <div className="2xl:max-w-[1000px] md:max-w-[600px] w-full mt-4 flex md:mt-0 md:ml-[4rem] search-bar-container items-center flex-grow md:pr-[2rem]">
          <SearchBar />
          <div className="ml-[1rem] mr-[1.563rem]">
            <button
              className={`${
                isFilterFormOpen ? "bg-gray-200 rounded-full" : ""
              }`}
              onClick={toggleFilterForm}
            >
              <img
                src={NavFilterIcon}
                alt="Filter icon"
                className="w-[3rem] h-[3rem]"
              />
            </button>
          </div>
        </div>

        <div className="hidden md:flex md:ml-auto md:justify-end md:mr-[3.75rem] desktop-icons flex-shrink-0">
          {icons.map((icon, index) => (
            <Link to={icon.path} key={index}>
              <button className={iconStyle}>
                <img src={icon.src} alt={icon.alt} width="44" height="44" />
              </button>
            </Link>
          ))}
        </div>
      </div>
      <div ref={sidebarRef}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Add the filter form */}
      <div className="relative">
        <FilterForm isOpen={isFilterFormOpen} onClose={toggleFilterForm} />
      </div>

      {/* Add extra margin when the filter form is open */}
      {isFilterFormOpen && <div className="h-[350px] md:h-[200px]"></div>}
    </nav>
  );
};

export default Navigation;
