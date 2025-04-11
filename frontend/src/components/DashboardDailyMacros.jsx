import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const DashboardDailyMacros = ({ selectedDate }) => {
  const [userMacros, setUserMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDailyMacros = async () => {
    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await axios.get(
        `${API_URL}/consumed/macros/${formattedDate}`,
        { withCredentials: true }
      );
      const data = response.data?.data || [];
      const macros =
        data.length > 0
          ? {
              protein: parseFloat(data[0].proteins) || 0,
              carbs: parseFloat(data[0].carbohydrates) || 0,
              fat: parseFloat(data[0].fats) || 0,
              calories: parseFloat(data[0].calories) || 0,
            }
          : { protein: 0, carbs: 0, fat: 0, calories: 0 };
      setUserMacros(macros);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch daily macros:", error);
      setError(error.response?.data?.message || "An error occurred");
      setUserMacros({ protein: 0, carbs: 0, fat: 0, calories: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyMacros();
  }, [selectedDate]);

  const pieData = [
    { name: "Fats", value: userMacros.fat, color: "#0D3559" },
    { name: "Carbs", value: userMacros.carbs, color: "#175D9C" },
    { name: "Proteins", value: userMacros.protein, color: "#A6CEF2" },
  ].filter((item) => item.value > 0);

  return (
    <div className="daily-macros">
      <h3 className="daily-macros__title">Daily Macros</h3>
      {isLoading ? (
        <p className="daily-macros__loading">Loading...</p>
      ) : error ? (
        <p className="daily-macros__error">Error: {error}</p>
      ) : (
        <div className="daily-macros__content">
          <div className="daily-macros__chart">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={5}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="daily-macros__calories"
                >
                  {Math.round(userMacros.calories)}
                </text>
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="daily-macros__calories-unit"
                >
                  calories
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="daily-macros__details">
            <p>
              <span
                className="daily-macros__color-box"
                style={{ backgroundColor: "#0D3559" }}
              ></span>
              Fats: {Math.round(userMacros.fat)}g
            </p>
            <p>
              <span
                className="daily-macros__color-box"
                style={{ backgroundColor: "#175D9C" }}
              ></span>
              Carbs: {Math.round(userMacros.carbs)}g
            </p>

            <p>
              <span
                className="daily-macros__color-box"
                style={{ backgroundColor: "#A6CEF2" }}
              ></span>
              Proteins: {Math.round(userMacros.protein)}g
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardDailyMacros;