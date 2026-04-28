// ============================================
// src/routes/ProtectedRoute.jsx
// ============================================
// Wraps any route that requires login.
// If user is NOT logged in → redirect to /login
// If user IS logged in → show the page
// ============================================

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While auth is being checked, show nothing
  // This prevents a flash of the login page
  // for users who are already logged in
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, send them to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in — render the actual page
  return children;
};

export default ProtectedRoute;

// ============================================
// src/routes/AdminRoute.jsx
// ============================================
// Same as ProtectedRoute but also checks
// if the user has the 'admin' role.
// Regular users trying to access /admin
// get redirected back to /home
// ============================================

export const AdminRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in at all → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin → go to home
  if (profile?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // User is admin — render the admin page
  return children;
};
