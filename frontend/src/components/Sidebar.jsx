import { Link } from "react-router";

import LogoutButton from "../navBarPages/LogoutButton";
import dashboardIcon from "../assets/icons/home.svg";
import favouriteIcon from "../assets/icons/heart.svg";
import shoppingIcon from "../assets/icons/shopping-cart.svg";
import profileIcon from "../assets/icons/profile-circle.svg";
import briefcaseIcon from "../assets/icons/briefcase.svg";
import addRecipeIcon from "../assets/icons/addRecipeSideBar.svg";
import myRecipesIcon from "../assets/icons/forkSpoon.svg";

const MENU_ITEMS = {
  main: [
    { to: "/dashboard", icon: dashboardIcon, text: "Dashboard" },
    { to: "/favourite", icon: favouriteIcon, text: "Favorite" },
    { to: "/myrecipes", icon: myRecipesIcon, text: "My Recipes" },
    { to: "/shoppingList", icon: shoppingIcon, text: "Shopping List" },
    { to: "/addRecipe", icon: addRecipeIcon, text: "Add recipe" },
  ],
  preferences: [
    { to: "/profile", icon: profileIcon, text: "Profile" },
    { to: "#", icon: briefcaseIcon, text: "Dark Mode" },
  ],
};

const MenuSection = ({ title, items, toggleSidebar }) => (
  <div>
    <h1 className="sidebar-section-title">{title}</h1>
    {items.map((item) => (
      <Link
        key={item.text}
        to={item.to}
        className="sidebar-link group"
        onClick={toggleSidebar}
      >
        <img
          src={item.icon}
          alt={`${item.text.toLowerCase()}Icon`}
          className="sidebar-icon"
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
    <div className="sidebar-container hide-scrollbar" onClick={handleSidebarClick}>
      <div className="sidebar-content">
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
      <div className="sidebar-logout">
        <LogoutButton toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
};

export default Sidebar;