// ============================================
// src/components/layout/UserLayout.jsx
// ============================================
// Wraps ALL user-facing pages with:
//   - UserNavbar at the top
//   - Footer at the bottom
//   - Proper top padding so content isn't
//     hidden behind the fixed navbar
//
// Usage in App.jsx:
//   <UserLayout><Home /></UserLayout>
//   <UserLayout><RestaurantDetail /></UserLayout>
// ============================================

import React from "react";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";

// ── PROP: children ─────────────────────────
// Whatever page is wrapped inside UserLayout
// e.g. <Home />, <RestaurantList />, etc.
const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      {/* Fixed navbar at top */}
      <UserNavbar />

      {/* Page content */}
      {/* pt-20 adds top padding so content starts below the fixed navbar */}
      <main className="flex-1 pt-20">{children}</main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default UserLayout;
