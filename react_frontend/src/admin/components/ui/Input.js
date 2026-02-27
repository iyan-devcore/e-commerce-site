import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon, rightElement, className = "", ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 
            ${icon ? 'pl-10' : 'pl-3'} 
            ${rightElement ? 'pr-10' : 'pr-3'} 
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'} 
            ${className}`}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && <p className="mt-1.5 text-sm text-red-600 animate-fadeIn">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
