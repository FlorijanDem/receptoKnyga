import { useEffect, useState } from "react";
import axios from "axios";
import { format, startOfWeek, addDays } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dayMap = {
      M: "Monday",
      T: "Tuesday",
      W: "Wednesday",
      Tu: "Thursday",
      F: "Friday",
      S: "Saturday",
      Sa: "Sunday",
    };
    const fullDay = dayMap[label] || label;

    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip__label">{`${fullDay}`}</p>
        {payload.map((entry, index) => (
          <div key={index} className="custom-tooltip__item">
            <span className="flex items-center">
              <span
                className="custom-tooltip__item-color"
                style={{ backgroundColor: entry.fill }}
              ></span>
              {entry.name}:
            </span>
            <span>
              {Math.round(entry.value)} {entry.name === "Calories" ? "" : "g"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardWeeklyMacros = ({ selectedDate, refreshKey }) => {
  const [weeklyMacros, setWeeklyMacros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchWeeklyMacros = async () => {
    setIsLoading(true);
    try {
      const formattedStartDate = format(weekStart, "yyyy-MM-dd");
      const response = await axios.get(
        `${API_URL}/consumed/weekly-macros/${formattedStartDate}`,
        { withCredentials: true }
      );
      const data = response.data?.data || [];
      setWeeklyMacros(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch weekly macros:", error);
      setError(error.response?.data?.message || "An error occurred");
      setWeeklyMacros([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyMacros();
  }, [selectedDate, refreshKey]);

  const totals = weeklyMacros.reduce(
    (acc, day) => ({
      calories: acc.calories + (parseFloat(day.calories) || 0),
      fats: acc.fats + (parseFloat(day.fats) || 0),
      carbs: acc.carbs + (parseFloat(day.carbohydrates) || 0),
      proteins: acc.proteins + (parseFloat(day.proteins) || 0),
    }),
    { calories: 0, fats: 0, carbs: 0, proteins: 0 }
  );

  const chartData = days.map((day, index) => ({
    day: format(day, "E").charAt(0).toUpperCase(),
    Calories: parseFloat(weeklyMacros[index]?.calories) || 0,
    Fats: parseFloat(weeklyMacros[index]?.fats) || 0,
    Carbs: parseFloat(weeklyMacros[index]?.carbohydrates) || 0,
    Proteins: parseFloat(weeklyMacros[index]?.proteins) || 0,
  }));

  return (
    <div className="dashboard-weekly">
      <h3 className="dashboard-weekly__title">
        Weekly Nutrition {format(weekStart, "yyyy-MM-dd")}
      </h3>

      {isLoading ? (
        <p className="dashboard-weekly__status">Loading...</p>
      ) : error ? (
        <p className="dashboard-weekly__error">Error: {error}</p>
      ) : (
        <div className="dashboard-weekly__graph-group">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="Calories"
                  stackId="a"
                  fill="#729CF1"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Fats"
                  stackId="a"
                  fill="#ED8B67"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Carbs"
                  stackId="a"
                  fill="#F6D170"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Proteins"
                  stackId="a"
                  fill="#74B78A"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-weekly__totals">Week totals</div>
          <div className="dashboard-weekly__totals-row">
            <span>Calories: {Math.round(totals.calories)}</span>
            <span>Fats: {Math.round(totals.fats)}</span>
            <span>Carbs: {Math.round(totals.carbs)}</span>
            <span>Proteins: {Math.round(totals.proteins)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardWeeklyMacros;
