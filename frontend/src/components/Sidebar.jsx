import { useEffect, useRef } from "react";
import NavLikeIcon from "../assets/icons/Like.svg";
import NavSettingIcon from "../assets/icons/Settings.svg";
import NavCartIcon from "../assets/icons/Cart.svg";
import NavProfileIcon from "../assets/icons/Profil.svg";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router";

const ICON_SIZE = 44;

const IconButton = ({ icon, to, onClick }) => (
  <Link to={to} onClick={onClick}>
    <button className="transition-transform duration-300 hover:scale-110 active:scale-90 mx-1 mb-3">
      <img src={icon} alt={icon} width={ICON_SIZE} height={ICON_SIZE} />
    </button>
  </Link>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (isOpen && !sidebarRef.current.contains(event.target)) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black transition-opacity duration-300 z-40 opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-[50px] bg-recipe-fifth border-r-1 border-recipe-secondary text-recipe-third transform flex flex-col z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button onClick={toggleSidebar} className="p-[0.85rem]">
          <IoClose className={`h-[25px] w-[25px]`} />
        </button>

        <IconButton
          icon={NavLikeIcon}
          to="/Favourite"
          onClick={toggleSidebar}
        />
        <IconButton
          icon={NavSettingIcon}
          to="/Settings"
          onClick={toggleSidebar}
        />
        <IconButton
          icon={NavCartIcon}
          to="/ShoppingList"
          onClick={toggleSidebar}
        />
        <IconButton
          icon={NavProfileIcon}
          to="/Profile"
          onClick={toggleSidebar}
        />
      </div>
    </>
  );
};

export default Sidebar;
