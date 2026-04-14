import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    // Robust check: Token must be non-null and match our secret session token
    // This prevents access with old/invalid tokens from previous sessions
    const isAuthenticated = adminToken === 'admin-secret-session-token' && adminUser;

    if (!isAuthenticated) {
        // Clear potential corrupted/old session data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        console.log("Admin access denied. Redirecting to login...");
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};



export default AdminProtectedRoute;
