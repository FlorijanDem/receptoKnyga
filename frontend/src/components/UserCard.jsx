// <<<<<<< HEAD
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const UserCard = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const banUser = async () => {
    if (currentUser.role === "admin") {
      toast.error("You can't ban an admin", { id: "ban-admin" });
      return;
    }
    try {
      const { data: response } = await axios.patch(
        `${API_URL}/users/${currentUser.id}`,
        { banned: !currentUser.banned },
        { withCredentials: true }
      );

      //   console.log(response);
      setCurrentUser(response.data);
      toast.success(
        `User ${response.data.username} ${
          response.data.banned ? "banned" : "unbanned"
        } successfully!`,
        { id: "ban-user" }
      );
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
      {currentUser.role !== "admin" && (
        <button
          onClick={banUser}
          className="cursor-pointer bg-[var(--color-recipe-fourth)] p-2 rounded-md text-[var(--color-recipe-fifth)]"
        >
          {currentUser.banned ? "Unban" : "Ban"}
        </button>
      )}
      {/* ======= */}
      {/* const UserCard = ({ user }) => {
  return (
    <div className="user-card my-2 mx-auto w-full bg-[var(--color-recipe-fifth)] py-2 px-4 rounded-xl">
<<<<<<< HEAD
      <p>{user.username}</p>
      <p>{user.email}</p>
      <p>{user.role}</p>
>>>>>>> 8f21a2f (Add basic user card)
=======
      <p>Username: {user.username}</p>
      <p className="text-[var(--color-recipe-secondary)]">{user.email}</p>
      <p>Role: {user.role}</p>
      {user.banned && (
        <p className="text-[var(--color-recipe-fourth)]">Banned</p>
      )}
>>>>>>> 094a1d4 (Change UsersList style) */}
    </div>
  );
};

export default UserCard;
