import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 backdrop-blur flex items-center justify-center border border-blue-400/30">
                            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Nexus Admin</span>
                    </div>
                    <h2 className="text-4xl font-extrabold leading-tight mb-6">
                        Manage your e-commerce <br /> empire with ease.
                    </h2>
                    <p className="text-blue-200 text-lg max-w-md leading-relaxed">
                        Track orders, manage inventory, and analyze customer trends in one unified dashboard.
                    </p>
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-800 blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-900 blur-3xl opacity-50"></div>

                <div className="relative z-10 text-sm text-blue-300/60 font-medium">
                    &copy; {new Date().getFullYear()} Nexus Inc. All rights reserved.
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white/50">
                <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
