import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3002/api/v1/auth/forgot-password`, { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error sending email');
        }
    };

    return (
        <div>
            <h2 className='text-2xl font-bold text-gray-800'>Forgot your password?</h2>
            <p className='text-lg font-bold text-blue-700'>Enter your email address below, and we’ll send you a link to reset your password.</p>
            <p className='text-sm text-gray-500'>
      (Check your spam folder if you don’t see the email within a few minutes.)
    </p>
            <form onSubmit={handleSubmit}>
                <input
                    className='bg-gray-200 rounded-lg p-2 ring-1 ring-gray-400 w-60'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button className="flex flex-col mt-4 text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2" type="submit">Send Reset Link</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ForgotPasswordPage; 