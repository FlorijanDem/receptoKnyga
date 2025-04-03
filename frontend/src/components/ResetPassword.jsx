import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';

const API_URL = import.meta.env.VITE_API_URL;


const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { newPassword });
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            setMessage('Error resetting password');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <p className='text-lg font-bold mb-4 mt-40 text-blue-700'>Having trouble logging in? Reset your password<br /><span className='ml-8'>and get back to tracking your calories!</span></p>
            <h2 className='text-2xl font-bold mb-4 text-gray-800'>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPassword" className='flex flex-col block mb-1 text-md font-medium text-gray-900'>
                    New Password*
                </label>
                <input
                    className='bg-gray-200 rounded-lg p-2 ring-1 ring-gray-400 w-60 mb-4'
                    type="password"
                    id='newPassword'
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                />
                <label htmlFor="confirmPassword" className='flex flex-col block mb-1 text-md font-medium text-gray-900'>
                    Confirm Password*
                </label>
                <input
                    className='bg-gray-200 rounded-lg p-2 ring-1 ring-gray-400 w-60'
                    type="password"
                    id='confirmPassword'
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                />
                <button className="flex flex-col mt-4 text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2" type="submit">Reset Password</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;