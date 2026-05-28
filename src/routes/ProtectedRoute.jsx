// ============================================
// src/routes/ProtectedRoute.jsx
// ============================================
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Shared loading spinner ─────────────────
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

// ── ProtectedRoute ─────────────────────────
// Blocks unauthenticated users from user pages.
// Waits for auth AND profile to resolve before deciding.
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user, profile } = useAuth();

  // Wait until session check is done
  if (loading) return <LoadingScreen />;

  // Not logged in → send to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Logged in but profile not yet fetched → keep waiting
  // (profile fetch happens async after session restore)
  if (user && profile === null) return <LoadingScreen />;

  return children;
};

// ── AdminRoute ─────────────────────────────
// Blocks non-admins from admin pages.
// CRITICAL: must wait for profile before checking role,
// otherwise a page reload shows profile=null → isAdmin=false
// and the admin gets kicked to /home incorrectly.
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user, profile, isAdmin } = useAuth();

  // Wait until session check is done
  if (loading) return <LoadingScreen />;

  // Not logged in at all → send to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Logged in but profile hasn't loaded yet → keep waiting
  // This is the key fix: don't evaluate isAdmin until profile exists
  if (user && profile === null) return <LoadingScreen />;

  // Profile loaded but not an admin → send to user home
  if (!isAdmin) return <Navigate to="/home" replace />;

  return children;
};

// ── PublicRoute ────────────────────────────
// Redirects already-authenticated users away from
// public pages like /, /login, /signup
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user, profile, isAdmin } = useAuth();

  if (loading) return <LoadingScreen />;

  // Logged in but profile not yet resolved → wait
  if (isAuthenticated && user && profile === null) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/home"} replace />;
  }

  return children;
};

export default ProtectedRoute;
