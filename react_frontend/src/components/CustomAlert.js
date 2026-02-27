import React, { useEffect } from 'react';

const CustomAlert = ({ message, type = 'error', onClose }) => {
    useEffect(() => {
        // Auto dismiss after 5 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 text-sm ${textColor} border ${borderColor} rounded-lg ${bgColor} shadow-lg animate-fade-in-down`} role="alert">
            <svg className={`flex-shrink-0 inline w-5 h-5 mr-3 ${iconColor}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                {type === 'success' ? (
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                ) : (
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                )}
            </svg>
            <span className="sr-only">{type === 'success' ? 'Success' : 'Error'}</span>
            <div className="font-medium mr-2">
                {message}
            </div>
            <button
                onClick={onClose}
                className={`ml-auto -mx-1.5 -my-1.5 ${bgColor} ${textColor} hover:bg-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-opacity-50 inline-flex items-center justify-center h-8 w-8`}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
    );
};

export default CustomAlert;
