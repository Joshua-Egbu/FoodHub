import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, LogOut, User, Bell, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ── PROP: onMenuToggle ──────────────────────
// AdminLayout passes this down so the navbar
// can toggle the sidebar on mobile
const AdminNavbar = ({ onMenuToggle, sidebarOpen }) => {
  const { profile, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* ── LEFT: Hamburger (mobile) + Logo ── */}
        <div className="flex items-center gap-4">
          {/* Mobile sidebar toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            <span
              className="text-lg font-bold text-white"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              FoodHub
            </span>
            {/* Admin badge */}
            <span
              className="hidden sm:inline-flex px-2 py-0.5 bg-orange-500/20 text-orange-400
                             text-xs font-semibold rounded-full border border-orange-500/30"
            >
              Admin
            </span>
          </Link>
        </div>

        {/* ── RIGHT: Notifications + Avatar ── */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>

          {/* Admin avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white leading-none">
                  {profile?.full_name?.split(" ")[0] || "Admin"}
                </p>
                <p className="text-xs text-orange-400 mt-0.5">Super Admin</p>
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 bg-slate-800 rounded-2xl
                              shadow-xl border border-slate-700 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-slate-700 mb-1">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {profile?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400
                             hover:bg-red-500/10 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
