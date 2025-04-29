import { Link } from "react-router";
import LogoutButton from "../navBarPages/LogoutButton";

import dashboardIcon from "../assets/icons/home.svg";
import favouriteIcon from "../assets/icons/heart.svg";
import shoppingIcon from "../assets/icons/shopping-cart.svg";
import settingsIcon from "../assets/icons/setting.svg";
import profileIcon from "../assets/icons/profile-circle.svg";
import briefcaseIcon from "../assets/icons/briefcase.svg";
import addRecipeIcon from "../assets/icons/addRecipeSideBar.svg";

const SIDEBAR_LINKS_CLASS = [
  "flex items-center justify-start ml-[16px]",
  "text-jakarta text-recipe-secondary text-[16px] font-medium tracking-[-0.32px]",
  "hover:bg-recipe-primary hover:text-white",
  "rounded-md transition-colors duration-200",
  "w-full h-[56px] px-[1rem] group",
].join(" ");

const SIDEBAR_ICONS_CLASS = [
  "mr-[0.75rem]",
  "group-hover:filter group-hover:brightness-0 group-hover:invert",
].join(" ");

const MENU_ITEMS = {
  main: [
    { to: "/dashboard", icon: dashboardIcon, text: "Dashboard" },
    { to: "/favourite", icon: favouriteIcon, text: "Favorite" },
    { to: "/shoppingList", icon: shoppingIcon, text: "Shopping List" },
    { to: "/addRecipe", icon: addRecipeIcon, text: "Add recipe" },
    { to: "/adminLogs" , icon: addRecipeIcon, text: "Admin Logs" },
  ],
  preferences: [
    { to: "/settings", icon: settingsIcon, text: "Settings" },
    { to: "/profile", icon: profileIcon, text: "Profile" },
    { to: "#", icon: briefcaseIcon, text: "Dark Mode" },
  ],
};

const MenuSection = ({ title, items, toggleSidebar }) => (
  <div>
    <h1 className="text-jakarta text-recipe-seventh font-semibold text-[12px] tracking-[0.2rem] opacity-40 pb-[2.625rem] pl-[2rem]">
      {title}
    </h1>
    {items.map((item) => (
      <Link
        key={item.text}
        to={item.to}
        className={SIDEBAR_LINKS_CLASS}
        onClick={toggleSidebar}
      >
        <img
          src={item.icon}
          alt={`${item.text.toLowerCase()}Icon`}
          className={SIDEBAR_ICONS_CLASS}
        />
        {item.text}
      </Link>
    ))}
  </div>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const handleSidebarClick = (e) => e.stopPropagation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-recipe-fifth w-[17.875rem] h-[100vh] flex flex-col justify-between z-50"
      onClick={handleSidebarClick}
    >
      <div className="pt-[2.25rem] pr-[2rem] space-y-[1.75rem]">
        <MenuSection
          title="MAIN MENU"
          items={MENU_ITEMS.main}
          toggleSidebar={toggleSidebar}
        />
        <MenuSection
          title="PREFERENCES"
          items={MENU_ITEMS.preferences}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div className="mb-[2rem]">
        <LogoutButton toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
};

export default Sidebar;
