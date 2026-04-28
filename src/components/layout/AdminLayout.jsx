// ============================================
// src/components/layout/AdminLayout.jsx
// ============================================
// Wraps ALL admin pages with:
//   - AdminNavbar at the top (fixed, dark)
//   - AdminSidebar on the left
//   - Main content area on the right
//   - NO footer (admin panels don't need one)
//
// Usage in App.jsx:
//   <AdminLayout><AdminDashboard /></AdminLayout>
//   <AdminLayout><ManageUsers /></AdminLayout>
// ============================================

import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  // Controls whether mobile sidebar is open
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Fixed top navbar */}
      {/* Passes toggle function so navbar hamburger can open/close sidebar */}
      <AdminNavbar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      {/* Sidebar — fixed on desktop, slide-in on mobile */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── MAIN CONTENT AREA ── */}
      {/* mt-16  → clears the fixed navbar height       */}
      {/* lg:ml-64 → shifts right on desktop to clear sidebar */}
      <main className="mt-16 lg:ml-64 min-h-[calc(100vh-4rem)]">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
