import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
            <div className="max-w-lg w-full text-center">
                <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500">
                    <img
                        src="/images/error_404.png"
                        alt="404 Page Not Found"
                        className="w-full h-auto rounded-2xl shadow-lg"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none"></div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-sans">
                    Oops! Page Not Found
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    It seems you've ventured into the unknown. The page you're looking for doesn't exist or has been moved.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
