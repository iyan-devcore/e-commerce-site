import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading | success | error | already
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            setStatus('error');
            setMessage('Invalid verification link. Please register again.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
                );
                const data = await res.json();

                if (res.ok) {
                    if (data.alreadyVerified) {
                        setStatus('already');
                        setMessage('Your email is already verified! You can log in.');
                    } else {
                        setStatus('success');
                        setMessage('Your email has been verified successfully!');
                        // Auto-login the user
                        if (data.data) {
                            localStorage.setItem('user', JSON.stringify(data.data));
                            window.dispatchEvent(new Event('cartUpdated'));
                            setTimeout(() => navigate('/'), 2500);
                        }
                    }
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed. The link may have expired.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Network error. Please try again.');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 text-center">
                {status === 'loading' && (
                    <>
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait a moment.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                        <p className="text-gray-500 mb-6">{message}</p>
                        <p className="text-sm text-gray-400 mb-6">You're being redirected to the home page...</p>
                        <Link to="/" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                            Go to Home
                        </Link>
                    </>
                )}

                {status === 'already' && (
                    <>
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Verified</h2>
                        <p className="text-gray-500 mb-6">{message}</p>
                        <Link to="/login" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                            Go to Login
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-gray-500 mb-6">{message}</p>
                        <Link to="/register" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-3">
                            Register Again
                        </Link>
                        <Link to="/login" className="block text-sm text-center text-blue-600 hover:underline">
                            Try logging in instead
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
