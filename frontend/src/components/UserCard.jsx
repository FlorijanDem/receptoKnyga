import axios from "axios";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const UserCard = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const banUser = async () => {
    try {
      const { data: response } = await axios.patch(
        `${API_URL}/users/${currentUser.id}`,
        { banned: !currentUser.banned },
        { withCredentials: true }
      );

      console.log(response);

      setCurrentUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="user-card my-2 mx-auto w-full bg-[var(--color-recipe-fifth)] py-2 px-4 rounded-xl">
      <p>Username: {currentUser.username}</p>
      <p className="text-[var(--color-recipe-secondary)]">
        {currentUser.email}
      </p>
      <p>Role: {user.role}</p>
      {currentUser.banned && (
        <p className="text-[var(--color-recipe-fourth)]">Banned</p>
      )}
      <button
        onClick={banUser}
        className="cursor-pointer bg-[var(--color-recipe-fourth)] p-2 rounded-md text-[var(--color-recipe-fifth)]"
      >
        {currentUser.banned ? "Unban" : "Ban"}
      </button>
    </div>
  );
};

export default UserCard;
