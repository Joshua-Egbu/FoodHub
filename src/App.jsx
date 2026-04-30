// ============================================
// src/App.jsx
// ============================================
// Root of the application.
// Layouts are applied HERE so individual pages
// never need to import Navbar or Footer.
//
// Pattern:
//   Public pages   → no layout (Login, Signup, Landing)
//   User pages     → wrapped in <UserLayout>
//   Admin pages    → wrapped in <AdminLayout>
// ============================================

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Route guards
import ProtectedRoute, { AdminRoute } from "./routes/ProtectedRoute";

// Layouts
import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Public pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";

// ── USER PLACEHOLDER PAGES ─────────────────
const Home = () => (
  <div className="max-w-7xl mx-auto px-6 py-16 text-center">
    <h1
      className="text-3xl font-bold text-gray-800"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      🍔 Home Page
    </h1>
    <p className="text-gray-500 mt-2">Coming in Day 6</p>
  </div>
);
const Restaurants = () => (
  <div className="max-w-7xl mx-auto px-6 py-16 text-center">
    <h1
      className="text-3xl font-bold text-gray-800"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      🍽️ Restaurant List
    </h1>
    <p className="text-gray-500 mt-2">Coming in Day 8</p>
  </div>
);
const Search = () => (
  <div className="max-w-7xl mx-auto px-6 py-16 text-center">
    <h1
      className="text-3xl font-bold text-gray-800"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      🔍 Search
    </h1>
    <p className="text-gray-500 mt-2">Coming in Day 13</p>
  </div>
);
const Cart = () => (
  <div className="max-w-7xl mx-auto px-6 py-16 text-center">
    <h1
      className="text-3xl font-bold text-gray-800"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      🛒 Cart
    </h1>
    <p className="text-gray-500 mt-2">Coming in Day 11</p>
  </div>
);
const Profile = () => (
  <div className="max-w-7xl mx-auto px-6 py-16 text-center">
    <h1
      className="text-3xl font-bold text-gray-800"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      👤 Profile
    </h1>
    <p className="text-gray-500 mt-2">Coming in Day 18</p>
  </div>
);

// ── ADMIN PLACEHOLDER PAGES ────────────────
const AdminDashboard = () => (
  <div className="text-center py-16">
    <h1
      className="text-3xl font-bold text-white"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      📊 Admin Dashboard
    </h1>
    <p className="text-gray-400 mt-2">Coming in Day 20</p>
  </div>
);
const ManageRestaurants = () => (
  <div className="text-center py-16">
    <h1
      className="text-3xl font-bold text-white"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      🍽️ Manage Restaurants
    </h1>
    <p className="text-gray-400 mt-2">Coming in Day 22</p>
  </div>
);
const ManageMenu = () => (
  <div className="text-center py-16">
    <h1
      className="text-3xl font-bold text-white"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      🍔 Manage Menu Items
    </h1>
    <p className="text-gray-400 mt-2">Coming in Day 23</p>
  </div>
);
const ManageReviews = () => (
  <div className="text-center py-16">
    <h1
      className="text-3xl font-bold text-white"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      ⭐ Manage Reviews
    </h1>
    <p className="text-gray-400 mt-2">Coming in Day 24</p>
  </div>
);
const ManageUsers = () => (
  <div className="text-center py-16">
    <h1
      className="text-3xl font-bold text-white"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      👥 Manage Users
    </h1>
    <p className="text-gray-400 mt-2">Coming in Day 25</p>
  </div>
);

// ── LAYOUT HELPERS ─────────────────────────
// These keep the Routes section clean.
// Instead of repeating ProtectedRoute + UserLayout
// on every single route, we just use <UserPage>
const UserPage = ({ children }) => (
  <ProtectedRoute>
    <UserLayout>{children}</UserLayout>
  </ProtectedRoute>
);

const AdminPage = ({ children }) => (
  <AdminRoute>
    <AdminLayout>{children}</AdminLayout>
  </AdminRoute>
);

// ══════════════════════════════════════════════
function App() {
  return (
    <>
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
          success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
        }}
      />

      <AuthProvider>
        {/* CartProvider is INSIDE AuthProvider so cart can
            access user info if needed in the future */}
        <CartProvider>
          <Routes>
            {/* PUBLIC — no layout */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* USER — UserLayout (navbar + footer) + ProtectedRoute */}
            <Route
              path="/home"
              element={
                <UserPage>
                  <Home />
                </UserPage>
              }
            />
            <Route
              path="/restaurants"
              element={
                <UserPage>
                  <Restaurants />
                </UserPage>
              }
            />
            <Route
              path="/restaurants/:id"
              element={
                <UserPage>
                  <div className="p-10 text-center text-gray-500">
                    Restaurant Detail - Day 9
                  </div>
                </UserPage>
              }
            />
            <Route
              path="/search"
              element={
                <UserPage>
                  <Search />
                </UserPage>
              }
            />
            <Route
              path="/cart"
              element={
                <UserPage>
                  <Cart />
                </UserPage>
              }
            />
            <Route
              path="/checkout"
              element={
                <UserPage>
                  <div className="p-10 text-center text-gray-500">
                    Checkout - Day 15
                  </div>
                </UserPage>
              }
            />
            <Route
              path="/order-success"
              element={
                <UserPage>
                  <div className="p-10 text-center text-gray-500">
                    Order Success - Day 17
                  </div>
                </UserPage>
              }
            />
            <Route
              path="/profile"
              element={
                <UserPage>
                  <Profile />
                </UserPage>
              }
            />

            {/* ADMIN — AdminLayout (dark navbar + sidebar) + AdminRoute */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminPage>
                  <AdminDashboard />
                </AdminPage>
              }
            />
            <Route
              path="/admin/restaurants"
              element={
                <AdminPage>
                  <ManageRestaurants />
                </AdminPage>
              }
            />
            <Route
              path="/admin/menu"
              element={
                <AdminPage>
                  <ManageMenu />
                </AdminPage>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <AdminPage>
                  <ManageReviews />
                </AdminPage>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminPage>
                  <ManageUsers />
                </AdminPage>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
