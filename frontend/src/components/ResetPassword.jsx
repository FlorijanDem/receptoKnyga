import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../contexts/UserContext';

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
    const { user } = useContext(UserContext);
    const [passwordData, setPasswordData] = useState({
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
            // The first argument must be of type string or an instance of Buffer, 
            // ArrayBuffer, or Array or an Array-like Object. Received undefined
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <p className='text-lg font-bold mb-4 text-blue-700'>Having trouble logging in? Reset your password<br/><span className='ml-8'>and get back to tracking your calories!</span></p>
            <h2 className='text-2xl font-bold mb-4 text-gray-800'>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
                <div className='mb-3'>
                    <label htmlFor="newPassword" className='flex flex-col block mb-1 text-md font-medium text-gray-900'>
                        New password*
                        </label>
                        <input
                        className='bg-gray-200 rounded-lg p-2 ring-1 ring-gray-400 w-60'
                            type="password"
                            id='newPassword'
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={6}
                        />
                    
                </div>
                <div className='mb-3'>
                    <label htmlFor="confirmPassword" className='flex flex-col block mb-1 text-md font-medium text-gray-900'>
                        Re-enter new Password*
                        </label>
                        <input
                        className='mb-2 bg-gray-200 rounded-lg p-2 ring-1 ring-gray-400 w-60'
                            type="password"
                            id='confirmPassword'
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={6}
                        />
                </div>
                <button className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;