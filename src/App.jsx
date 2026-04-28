import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "./context/AuthContext";

// Route
import ProtectedRoute, { AdminRoute } from "./routes/ProtectedRoute";

// Pages - User
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";

// Pages
const Home = () => (
  <div className="min-h-screen bg-amber-50 flex items-center justify-center">
    <div className="text-center">
      <h1
        className="text-3xl font-bold text-gray-800"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        🍔 Home Page
      </h1>
      <p className="text-gray-500 mt-2">Coming in Day 6</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1
        className="text-3xl font-bold text-white"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        🔑 Admin Dashboard
      </h1>
      <p className="text-gray-400 mt-2">Coming in Day 19</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      {/* ── TOAST NOTIFICATIONS ── */}
      {/* react-hot-toast renders notifications here */}
      {/* position: top-right means they appear top-right of screen */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#f97316",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* ── ROUTES ── */}
      {/* AuthProvider wraps everything so all pages
       have access to user, login, logout etc. */}
      <AuthProvider>
        <Routes>
          {/* public */}
          {/* Anyone can visit these, logged in or not */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── PROTECTED USER ROUTES ── */}
          {/* Must be logged in.  */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* ── PROTECTED ADMIN ROUTES ── */}
          {/* Must be logged in and have admin role*/}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ── 404 FALLBACK ── */}
          {/* Any unknown URL redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
