import React from 'react';
import { Navigate } from 'react-router-dom';
import UseAuth from '../hook/UseAuth';

const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = UseAuth();

    console.log("🔹 ProtectedRoute - User:", user);
    console.log("🔹 ProtectedRoute - isAuthenticated:", isAuthenticated);
    console.log("🔹 ProtectedRoute - User Role:", user?.role);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        console.warn("🚨 Access Denied - Not an Admin");
        return <Navigate to="/" replace />;
    }

    console.log("✅ Access Granted - Admin User");
    return children;
};

export default ProtectedRoute;
