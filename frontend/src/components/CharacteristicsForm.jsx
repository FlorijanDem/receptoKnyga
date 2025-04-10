// activityLevel nera saugomas ir dabar skirtas pasizaisti reiki tvarkyti DB
// activityLevel yra tik fronte
// reikia iskelti error apdorojima
// suvienodinti dizaina
// iskelti validacija

import { useState, useEffect } from "react";
import axios from "axios";
import { differenceInYears } from "date-fns";
import { ACTIVITY_LEVELS, calculateAllMetrics } from "../utils/calculator";

const API_URL = import.meta.env.VITE_API_URL;

const CharacteristicsForm = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    height: "",
    weight: "",
    age: "",
    date_of_birth: "",
    gender: "",
    activityLevel: "SEDENTARY",
  });

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (data.height && data.weight && data.age && data.gender) {
      try {
        const metrics = calculateAllMetrics(
          parseFloat(data.weight),
          parseFloat(data.height),
          parseInt(data.age),
          data.gender,
          ACTIVITY_LEVELS[data.activityLevel].multiplier
        );
        setResults(metrics);
      } catch (error) {
        console.error("Failed to calculate metrics:", error);
        setResults(null);
      }
    }
  }, [data]);

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const response = await axios.get(`${API_URL}/characteristics`, {
          withCredentials: true,
        });
        const { user_id: _, ...filteredData } = response.data.data;
        setData({
          ...filteredData,
          age: differenceInYears(
            new Date(),
            new Date(filteredData.date_of_birth)
          ),
          weight: filteredData.weightHistory.at(0).weight,
          activityLevel: "SEDENTARY", // Initialize with default activity level
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch characteristics"
        );
      }
    };

    fetchCharacteristics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.height || !data.weight || !data.date_of_birth || !data.gender) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axios.patch(
        `${API_URL}/characteristics`,
        {
          height: parseInt(data.height),
          weight: parseFloat(data.weight),
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          // activityLevel: data.activityLevel kai bus db
        },
        {
          withCredentials: true,
        }
      );
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message);
        } else if (error.request) {
          setError("Something went wrong. Please try again later.");
        } else {
          setError("Network error. Please check your internet connection.");
        }
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Characteristics</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <input
            type="number"
            name="height"
            value={data.height}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={data.weight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
          />
        </div>

        <div className="flex justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={data.date_of_birth?.split("T")[0] || ""}
              onChange={handleChange}
              className="mt-1 block  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min={
                new Date(new Date().setFullYear(new Date().getFullYear() - 120))
                  .toISOString()
                  .split("T")[0]
              }
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={
                differenceInYears(new Date(), new Date(data.date_of_birth)) ||
                ""
              }
              onChange={handleChange}
              className="mt-1 block  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              max="150"
              disabled
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Activity Level
          </label>
          <select
            name="activityLevel"
            value={data.activityLevel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.entries(ACTIVITY_LEVELS).map(([key, level]) => (
              <option key={key} value={key}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>

      {results && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Calorie Calculator Results
          </h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">BMR (Basal Metabolic Rate):</span>
              <span className="ml-2">
                {results.bmr.toFixed(0)} calories/day
              </span>
            </div>
            <div>
              <span className="font-medium">Daily Calorie Needs:</span>
              <span className="ml-2">
                {results.dailyCalories.toFixed(0)} calories/day
              </span>
            </div>
            <div>
              <span className="font-medium">BMI (Body Mass Index):</span>
              <span className="ml-2">{results.bmi.toFixed(1)}</span>
            </div>
            <div>
              <span className="font-medium">BMI Category:</span>
              <span className="ml-2">{results.bmiCategory.label}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default CharacteristicsForm;
