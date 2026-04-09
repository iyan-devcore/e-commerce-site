import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
        // Redirect to admin login page if admin is not authenticated
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
