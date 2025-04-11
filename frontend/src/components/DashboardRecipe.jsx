import { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const DashboardRecipe = ({
  selectedDate,
  onAddRecipeClick,
  refreshKey,
}) => {
  const [consumedList, setConsumedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchConsumed = async () => {
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const res = await axios.get(`${API_URL}/consumed/${formattedDate}`, {
        withCredentials: true,
      });
      setConsumedList(res.data?.data || []);
    } catch (error) {
      console.error("Failed to load consumed:", error);
      setConsumedList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumed();
  }, [selectedDate, refreshKey]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/consumed/${id}`, {
        withCredentials: true,
      });
      fetchConsumed();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="dashboard-recipe">
      <button onClick={onAddRecipeClick} className="dashboard-recipe__add-btn">
        Add Consumed Recipe
      </button>

      {loading ? (
        <p className="dashboard-recipe__status">Loading...</p>
      ) : consumedList.length === 0 ? (
        <p className="dashboard-recipe__status">
          No recipes consumed on this day.
        </p>
      ) : (
        <ul className="dashboard-recipe__list">
          {consumedList.map((item) => (
            <li key={item.id} className="dashboard-recipe__item">
              <div>
                <p className="dashboard-recipe__date">
                  {format(parseISO(item.datetime), "HH:mm")}
                </p>
                <p className="dashboard-recipe__title">
                  <a href={item.recipe_id ? `/recipe/${item.recipe_id}` : "#"}>
                    {item.title}
                  </a>
                </p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="dashboard-recipe__delete"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardRecipe