import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { differenceInYears } from "date-fns";
import { calculateAllMetrics } from "../utils/calculator";
const API_URL = import.meta.env.VITE_API_URL;

const DashboardDailyMacros = ({ selectedDate, refreshKey }) => {
  const [userMacros, setUserMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCharacteristics, setIsLoadingCharacteristics] =
    useState(true);
  const [isLoadingActivityLevels, setIsLoadingActivityLevels] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activityLevels, setActivityLevels] = useState();
  const [characteristicsData, setCharacteristicsData] = useState({
    height: "",
    weight: "",
    age: "",
    date_of_birth: "",
    gender: "",
    activity_level_id: "",
    my_goals: "",
  });

  const fetchActivityLevels = async () => {
    try {
      const response = await axios.get(`${API_URL}/activity`, {
        withCredentials: true,
      });
      setActivityLevels(response.data.data);
    } catch (err) {
      console.error("Failed to fetch activity levels", err);
    } finally {
      setIsLoadingActivityLevels(false);
    }
  };

  const fetchCharacteristics = async () => {
    try {
      const response = await axios.get(`${API_URL}/characteristics`, {
        withCredentials: true,
      });
      const { user_id: _, ...filteredData } = response.data.data;

      setCharacteristicsData({
        ...filteredData,
        age: differenceInYears(
          new Date(),
          new Date(filteredData.date_of_birth)
        ),
        weight: filteredData.weightHistory[0].weight,
      });
    } catch (err) {
      console.error("Failed to fetch characteristics", err);
    } finally {
      setIsLoadingCharacteristics(false);
    }
  };

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
  }, [selectedDate, refreshKey]);

  useEffect(() => {
    if (characteristicsData && activityLevels && activityLevels.length > 0) {
      const metrics = calculateAllMetrics(
        parseFloat(characteristicsData.weight),
        parseFloat(characteristicsData.height),
        parseInt(characteristicsData.age),
        characteristicsData.gender,
        activityLevels.find(
          (level) => level.id === +characteristicsData.activity_level_id
        )?.multiplier || 1,
        String(characteristicsData.my_goals)
      );

      setResult(metrics);
    }
  }, [characteristicsData, activityLevels]);

  useEffect(() => {
    fetchActivityLevels();
    fetchCharacteristics();
  }, [userMacros]);

  const pieData = [
    { name: "Fats", value: userMacros.fat, color: "#0D3559" },
    { name: "Carbs", value: userMacros.carbs, color: "#175D9C" },
    { name: "Proteins", value: userMacros.protein, color: "#A6CEF2" },
  ].filter((item) => item.value > 0);

  return (
    <div className="daily-macros">
      {isLoading || isLoadingCharacteristics || isLoadingActivityLevels ? (
        <p className="daily-macros__loading">Loading...</p>
      ) : error ? (
        <p className="daily-macros__error">Error: {error}</p>
      ) : (
        <div className="daily-macros__content">
          <h3 className="daily-macros__title">Daily Nutrition</h3>
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
      <div className="bg-[var(--color-recipe-fifth)] rounded-lg mb-4 shadow-md p-4 flex flex-col items-center">
        {(() => {
          const calorieDifference =
            Number(result?.dailyCalories.toFixed(0)) -
            Math.round(userMacros.calories);

          if (calorieDifference <= 0) {
            return (
              <>
                <p className="text-red-600 font-semibold">
                  You've reached your daily calorie goal.
                </p>
                <p className="text-base text-gray-500">
                  Limit exceeded by{" "}
                  <span className=" text-red-500 font-bold text-lg">
                    {Math.abs(calorieDifference)}
                  </span>{" "}
                  calories.
                </p>
              </>
            );
          } else {
            return (
              <>
                <p className="text-blue-800 font-bold text-lg">
                  You've still got some calories left for today!
                </p>
                <p className="text-base text-gray-500">
                  Remaining calories:{" "}
                  <span className="font-semibold text-blue-800">
                    {Math.abs(calorieDifference)}
                  </span>{" "}
                </p>
              </>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default DashboardDailyMacros;
