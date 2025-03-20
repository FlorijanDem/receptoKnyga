import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../contexts/UserContext';

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
    const { user } = useContext(UserContext);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user) {
            setError("The user is not logged in, please login");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        
        if (passwordData.newPassword === passwordData.currentPassword) {
            setError("New password cannot be the same as the current password");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.patch(
                `${API_URL}/auth/update-password`,
                {

                    newPassword: passwordData.newPassword
                },
                {
                    withCredentials: true,
                }
            );

            if (response.data.status === "success") {
                setSuccess("Password updated successfully");
                setPasswordData({
                    newPassword: '',
                    confirmPassword: ''
                });
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
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
                <div>
                    <label>
                        New password*
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
                        Re-enter new Password*
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
                <button className="char-button" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;