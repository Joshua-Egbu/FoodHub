// ============================================
// src/App.jsx
// ============================================
// Root of the application.
// Layouts are applied HERE so individual pages
// never need to import Navbar or Footer.
//
// Pattern:
//   Public pages   → no layout
//   User pages     → wrapped in UserLayout
//   Admin pages    → wrapped in AdminLayout
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

// ── PUBLIC PAGES ────────────────────────────
import LandingPage from "./pages/LandingPage";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";

// ── USER PAGES (real components) ────────────
import Home from "./pages/user/Home";
import RestaurantList from "./pages/user/RestaurantList";
import RestaurantDetail from "./pages/user/RestaurantDetail";
// import Search from "./pages/user/Search";
import Cart from "./pages/user/Cart";

// ── USER PAGES (placeholders — replaced day by day) ──

const Checkout = () => (
  <div className="max-w-7xl mx-auto px-6 py-16 text-center">
    <h1
      className="text-3xl font-bold text-gray-800"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      💳 Checkout
    </h1>
    <p className="text-gray-500 mt-2">Coming in Day 9</p>
  </div>
);
const OrderSuccess = () => (
  <div className="max-w-7xl mx-auto px-6 py-16 text-center">
    <h1
      className="text-3xl font-bold text-gray-800"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      ✅ Order Success
    </h1>
    <p className="text-gray-500 mt-2">Coming in Day 10</p>
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
    <p className="text-gray-500 mt-2">Coming in Day 11</p>
  </div>
);

// ── ADMIN PLACEHOLDER PAGES ─────────────────
const AdminDashboard = () => (
  <div className="text-center py-16">
    <h1
      className="text-3xl font-bold text-white"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      📊 Admin Dashboard
    </h1>
    <p className="text-gray-400 mt-2">Coming in Day 12</p>
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
    <p className="text-gray-400 mt-2">Coming in Day 13</p>
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
    <p className="text-gray-400 mt-2">Coming in Day 14</p>
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
    <p className="text-gray-400 mt-2">Coming in Day 15</p>
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
    <p className="text-gray-400 mt-2">Coming in Day 16</p>
  </div>
);

// ── LAYOUT HELPERS ──────────────────────────
// Keeps route definitions clean and readable
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
        <CartProvider>
          <Routes>
            {/* ── PUBLIC ── */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ── USER ── */}
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
                  <RestaurantList />
                </UserPage>
              }
            />
            <Route
              path="/restaurants/:id"
              element={
                <UserPage>
                  <RestaurantDetail />
                </UserPage>
              }
            />
            <Route
              path="/search"
              element={<UserPage>{/* <Search /> */}</UserPage>}
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
                  <Checkout />
                </UserPage>
              }
            />
            <Route
              path="/order-success"
              element={
                <UserPage>
                  <OrderSuccess />
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

            {/* ── ADMIN ── */}
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

            {/* ── 404 ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
