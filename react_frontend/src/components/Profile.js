import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/register');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/login');
    };

    if (!user) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-50 flex py-12 justify-center">
            <div className="max-w-2xl w-full px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 relative"></div>
                    
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md flex items-center justify-center">
                                {user.imageUpload ? (
                                    <img 
                                        src={user.imageUpload} 
                                        alt={`${user.firstName} ${user.lastName}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                            >
                                Log out
                            </button>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                            <p className="text-gray-500 mt-1">{user.email}</p>
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between border-b border-gray-200 pb-3">
                                    <span className="text-gray-500">First Name</span>
                                    <span className="font-medium text-gray-900">{user.firstName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-3">
                                    <span className="text-gray-500">Last Name</span>
                                    <span className="font-medium text-gray-900">{user.lastName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email Address</span>
                                    <span className="font-medium text-gray-900">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
