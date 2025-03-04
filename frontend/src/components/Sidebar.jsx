import { useEffect, useRef } from "react";
import NavLikeIcon from "../assets/icons/Like.svg";
import NavSettingIcon from "../assets/icons/Settings.svg";
import NavCartIcon from "../assets/icons/Cart.svg";
import NavProfileIcon from "../assets/icons/Profil.svg";
import { IoClose } from "react-icons/io5";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      isOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const iconStyle =
    "transition-transform duration-300 hover:scale-110 active:scale-90 mx-1 mb-3";

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

        <button
          onClick={() => console.log("Redirecting to Like Page...")}
          className={iconStyle}
        >
          <img src={NavLikeIcon} alt="like Icon" width="44" height="44" />
        </button>
        <button
          onClick={() => console.log("Redirecting to Settings Page...")}
          className={iconStyle}
        >
          <img src={NavSettingIcon} alt="setting Icon" width="44" height="44" />
        </button>
        <button
          onClick={() => console.log("Redirecting to Cart Page...")}
          className={iconStyle}
        >
          <img src={NavCartIcon} alt="cart Icon" width="44" height="44" />
        </button>
        <button
          onClick={() => console.log("Redirecting to Profile Page...")}
          className={iconStyle}
        >
          <img src={NavProfileIcon} alt="profile Icon" width="44" height="44" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
