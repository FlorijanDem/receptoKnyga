import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import UserContext from '../contexts/UserContext';

const API_URL = import.meta.env.VITE_API_URL;

const CharesteristicForm = () => {


  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    isMetric: true,
    username: "",
    gender: "",
    weight: "",
    age: "",
    height: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchCharacteristics = async () => {
      if (!user) return;

      try {
        const response = await axios.get(`${API_URL}/characteristics`, {
          withCredentials: true,
        });

        if (response.data.data) {
          setFormData(prevData => ({
            ...prevData,
            ...response.data.data
          }));
          setHasExistingData(true);
        }
      } catch (error) {
        console.error('Error fetching characteristics:', error);
      }
    };

    fetchCharacteristics();
  }, [user]);

  useEffect(() => {
    if (user?.username) {
      setFormData(prevData => ({
        ...prevData,
        username: user.username
      }));
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!user) {
      setError("The user is not logged in, please login");
      setLoading(false);
      return;
    }

    if (!formData.gender || !formData.weight || !formData.age || !formData.height) {
      setError("Please fill in all of the required fields");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        height: formData.height,
        weight: formData.weight,
        age: formData.age,
        gender: formData.gender
      };

      const method = hasExistingData ? 'patch' : 'post';
      const response = await axios[method](`${API_URL}/characteristics`, dataToSend, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setSuccess(hasExistingData 
          ? "Characteristics updated successfully" 
          : "Characteristics added successfully"
        );
        setHasExistingData(true);
      }
    } catch (error) {
      console.error('Error saving characteristics:', error);
      setError(error.response?.data?.message || 'Failed to save characteristics');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!user) {
      setError("The user is not logged in, please login");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/auth/update-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        setSuccess("Password updated successfully");
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordReset(false);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <div>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </label>
        </div>

        <div>
          <label>
            Gender:
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>

        <div>
      <div>
        <label>
          Weight (kg):
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Enter weight"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Height (cm):
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Enter height"
            required
          />
        </label>
      </div>
    </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : hasExistingData ? 'Update' : 'Add'}
        </button>
      </form>

      <div>
        <button 
          type="button" 
          onClick={() => setShowPasswordReset(!showPasswordReset)}
        >
          {showPasswordReset ? 'Hide Password Reset' : 'Reset Password'}
        </button>

        {showPasswordReset && (
          <form onSubmit={handlePasswordReset}>
            <div>
              <label>
                Current Password:
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                New Password:
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
              </label>
            </div>
            <div>
              <label>
                Confirm New Password:
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
              </label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CharesteristicForm;
