import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const CharacteristicsForm = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const response = await axios.get(`${API_URL}/characteristics`, {
          withCredentials: true,
        });
        setData(response.data.data);
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
          setError(error);
        }
      }
    };
    fetchCharacteristics();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${API_URL}/characteristics`, data, {
        withCredentials: true,
      });
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
        setError(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="number"
        name="height"
        value={data.height}
        onChange={handleChange}
        placeholder="Height"
        className="input"
      />
      <input
        type="number"
        name="weight"
        value={data.weight}
        onChange={handleChange}
        placeholder="Weight"
        className="input"
      />
      <input
        type="number"
        name="age"
        value={data.age}
        onChange={handleChange}
        placeholder="Age"
        className="input"
      />
      <select
        name="gender"
        value={data.gender}
        onChange={handleChange}
        className="input"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <button type="submit" className="btn btn-primary">
        Update
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default CharacteristicsForm;
