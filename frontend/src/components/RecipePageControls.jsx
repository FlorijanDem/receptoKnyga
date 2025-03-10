import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const RecipePageControls = ({ recipe }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  console.log(user.id);
  console.log(recipe);

  const editRecipe = async () => {
    // Need add recipe form
    console.log("Edit recipe");
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
      const updatedRecipe = await axios.patch(
        `${API_URL}/recipes/${recipe.id}`,
        { approved: !recipe.approved },
        {
          withCredentials: true,
        }
      );
      console.log(updatedRecipe);
    } catch (error) {
      console.log(error);
    }
  };
  const banUser = async () => {};

  return (
    <>
      <div className="recipe-controls grid grid-cols-2 gap-2 mt-4">
        {(user?.id === recipe?.user_id || user?.role === "admin") && (
          <>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-lg"
              onClick={editRecipe}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded-lg"
              onClick={() => setOpenDelete(!openDelete)}
            >
              Delete
            </button>
          </>
        )}
        {user?.role === "admin" && (
          <>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-lg"
              onClick={approveRecipe}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded-lg"
              onClick={banUser}
            >
              Ban User
            </button>
          </>
        )}
      </div>
      {openDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete recipe for {recipe?.title}?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={deleteRecipe}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
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
