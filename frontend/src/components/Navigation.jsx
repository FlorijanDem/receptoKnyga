import React, { useState } from "react";
import { Link } from "react-router";
import NavLikeIcon from "../assets/icons/Like.svg";
import NavSettingIcon from "../assets/icons/Settings.svg";
import NavCartIcon from "../assets/icons/Cart.svg";
import NavProfileIcon from "../assets/icons/Profil.svg";
import NavMenuIcon from "../assets/icons/Menu.svg";
import NavFilterIcon from "../assets/icons/Filter.svg";

import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";

const icons = [
  { src: NavLikeIcon, alt: "like Icon", pagename: "Like", path: "/Favourite" },
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
    path: "/ShoppingList",
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

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const iconStyle =
    "mx-[0.625rem] transition-transform duration-300 hover:scale-110 active:scale-90";

  return (
    <nav>
      <div className="flex flex-col md:flex-row items-center mx-[1.563rem] mt-[2rem] mb-[2rem]">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link to="/">
            <h1 className="font-jakarta text-recipe-primary font-bold tracking-[-1px] text-[24px] md:text-[32px] xl:text-[60px] 2xl:text-[80px] 2xl:ml-[3.75rem]">
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
            <button className="">
              <img
                src={NavFilterIcon}
                alt="Filter icon"
                className="w-[3rem] h-[3rem] 2xl:w-[6rem] 2xl:h-[6rem]"
              />
            </button>
          </div>
        </div>

        <div className="hidden md:flex md:ml-auto md:justify-end md:mr-[3.75rem]  desktop-icons flex-shrink-0">
          {icons.map((icon, index) => (
            <Link to={icon.path} key={index}>
              <button className={iconStyle}>
                <img
                  src={icon.src}
                  alt={icon.alt}
                  width="44"
                  height="44"
                  className="2xl:w-[5rem] 2xl:h-[5rem]"
                />
              </button>
            </Link>
          ))}
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </nav>
  );
};

export default Navigation;
