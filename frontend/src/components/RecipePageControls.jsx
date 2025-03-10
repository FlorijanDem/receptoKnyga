import { useContext } from "react";
import UserContext from "../contexts/UserContext";

const RecipePageControls = ({ recipe }) => {
  const { user } = useContext(UserContext);
  console.log(user.id);
  console.log(recipe);

  return (
    <div className="recipe-controls grid grid-cols-2 gap-2 mt-4">
      {user?.id === recipe?.user_id && (
        <>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-lg">
            Edit
          </button>
          <button className="bg-red-500 text-white px-4 py-1 rounded-lg">
            Delete
          </button>
        </>
      )}
      {user?.role === "admin" && (
        <>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-lg">
            Approve
          </button>
          <button className="bg-red-500 text-white px-4 py-1 rounded-lg">
            Ban User
          </button>
        </>
      )}
    </div>
  );
};

export default RecipePageControls;
