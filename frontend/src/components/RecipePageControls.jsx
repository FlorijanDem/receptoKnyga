import { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const RecipePageControls = ({ recipe, setRecipe, setRefresh }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  // console.log(user.id);
  // console.log(recipe);

  const editRecipe = async () => {
    navigate(`/editRecipe`, { state: { recipe } });
  };

  const deleteRecipe = async () => {
    try {
      await axios.delete(`${API_URL}/recipes/${recipe.id}`, {
        withCredentials: true,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const approveRecipe = async () => {
    try {
      const { data: response } = await axios.patch(
        `${API_URL}/recipes/${recipe.id}`,
        { approved: !recipe.approved },
        {
          withCredentials: true,
        }
      );
      setRecipe(response);
      toast.success(
        `Recipe ${recipe.title} ${
          response.data.approved ? "approved" : "unapproved"
        } successfully!`,
        {
          duration: 3000,
          id: "approve-recipe",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const banUser = async () => {
    if (recipe.user_id === user.id && user.role === "admin") {
      return;
    }
    try {
      const { data: response } = await axios.patch(
        `${API_URL}/users/${recipe.user_id}`,
        { banned: !recipe.user_banned },
        {
          withCredentials: true,
        }
      );

      toast.success(
        `User ${response.data.username} ${
          response.data.banned ? "banned" : "unbanned"
        } successfully!`,
        {
          id: "ban-user",
        }
      );
      // console.log(recipe);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="recipe-controls grid grid-cols-2 gap-2 mt-4">
        {/* Edit / delete recipe control buttons */}
        {(user?.id === recipe?.user_id || user?.role === "admin") && (
          <>
            <button
              className="bg-[var(--color-recipe-primary)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
              onClick={editRecipe}
            >
              Edit
            </button>
            <button
              className="bg-[var(--color-recipe-fourth)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
              onClick={() => setOpenDelete(!openDelete)}
            >
              Delete
            </button>
          </>
        )}
        {user?.role === "admin" && (
          <>
            <button
              className="bg-[var(--color-recipe-primary)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
              onClick={approveRecipe}
            >
              {recipe.approved ? "Unapprove" : "Approve"}
            </button>
            <button
              className="bg-[var(--color-recipe-fourth)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
              onClick={banUser}
            >
              {recipe.user_banned ? "Unban user" : "Ban user"}
            </button>
          </>
        )}
      </div>
      {/* Confirm delete recipe modal */}
      {openDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-recipe-fifth)] p-4 rounded-lg w-9/12 max-w-[600px]">
            <h2 className="text-lg text-[var(--color-recipe-third)] font-bold mb-2">
              Are you sure?
            </h2>
            <p className="text-sm text-[var(--color-recipe-third)] mb-4">
              Are you sure you want to delete recipe for:{" "}
              <span className="font-bold block break-words">
                {recipe?.title}?
              </span>
            </p>
            <div className="flex justify-end">
              <button
                className="bg-[var(--color-recipe-fourth)] text-[var(--color-recipe-fifth)] px-4 py-2 rounded-lg mr-2"
                onClick={deleteRecipe}
              >
                Delete
              </button>
              <button
                className="bg-[var(--color-recipe-secondary)] text-[var(--color-recipe-fifth)] px-4 py-2 rounded-lg"
                onClick={() => setOpenDelete(!openDelete)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipePageControls;
