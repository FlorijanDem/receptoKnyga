import { useState } from "react";
import { format, startOfWeek, addDays, subDays, isSameDay } from "date-fns";
import DashboardRecipe from "../components/DashboardRecipe";
import DashboardDailyMacros from "../components/DashboardDailyMacros";
import DashboardWeeklyMacros from "../components/DashboardWeeklyMacros";
import AddRecipeModal from "../components/AddRecipeModal";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleAddRecipe = async (data) => {
    try {
      await axios.post(`${API_URL}/consumed/`, data, { withCredentials: true });
      setIsAddRecipeOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to add recipe:", error);
    }
  };

  const handleDeleteRecipe = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <button
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="nav-btn light"
          >
            &lt;&lt;
          </button>
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="date-input"
            aria-label="Select date"
          />
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="nav-btn light"
          >
            &gt;&gt;
          </button>
        </div>

        <div className="week-selector">
          {days.map((day) => (
            <button
              key={day}
              className={`day-button ${
                isSameDay(day, selectedDate) ? "day-button--active" : ""
              }`}
              onClick={() => setSelectedDate(day)}
            >
              <span>{format(day, "E").charAt(0)}</span>
              <span>{format(day, "d")}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="daily-nutrition">
          <h2 className="section-title">Daily Nutrition</h2>
          <DashboardRecipe
            selectedDate={selectedDate}
            onAddRecipeClick={() => setIsAddRecipeOpen(true)}
            onDeleteRecipe={handleDeleteRecipe}
            refreshKey={refreshKey}
          />
        </div>

        <div className="macros-column">
          <DashboardDailyMacros
            selectedDate={selectedDate}
            refreshKey={refreshKey}
          />
          <DashboardWeeklyMacros
            selectedDate={selectedDate}
            refreshKey={refreshKey}
          />
        </div>
      </div>

      {isAddRecipeOpen && (
        <AddRecipeModal
          isOpen={isAddRecipeOpen}
          onClose={() => setIsAddRecipeOpen(false)}
          onSubmit={handleAddRecipe}
          defaultDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Dashboard;
