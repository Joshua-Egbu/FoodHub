// ============================================
// src/components/layout/UserNavbar.jsx
// ============================================
// The main navbar for all user-facing pages.
// Shows: Logo, nav links, cart icon, avatar
// Highlights the active link automatically.
// On mobile: collapses into a hamburger menu.
// ============================================

import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  UtensilsCrossed,
  ShoppingCart,
  User,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Home,
  Store,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useCart from "../../hooks/useCart";

const UserNavbar = () => {
  const { profile, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const [mobileOpen, setMobileOpen] = useState(false); // hamburger menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // avatar dropdown
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active link style — orange + underline for current page
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-orange-500 border-b-2 border-orange-500 pb-0.5"
        : "text-gray-600 hover:text-orange-500"
    }`;

  // Mobile nav link style
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-orange-50 text-orange-500"
        : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
    }`;

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* ── MAIN BAR ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* ── LOGO ── */}
        <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
          <UtensilsCrossed className="w-7 h-7 text-orange-500" />
          <span
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            FoodHub
          </span>
        </Link>

        {/* ── DESKTOP NAV LINKS ── */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/home" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/restaurants" className={navLinkClass}>
            Restaurants
          </NavLink>
          <NavLink to="/search" className={navLinkClass}>
            <span className="flex items-center gap-1">
              <Search className="w-3.5 h-3.5" />
              Search
            </span>
          </NavLink>
        </div>

        {/* ── RIGHT SIDE: Cart + Avatar (desktop) ── */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart icon */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white
                               text-xs font-bold rounded-full flex items-center justify-center"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-orange-50 transition-colors"
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
                    {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {profile?.full_name?.split(" ")[0] || "User"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl
                              border border-gray-100 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {profile?.email}
                  </p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700
                             hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500
                             hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── MOBILE: Cart badge + Hamburger ── */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/cart"
            className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white
                               text-xs font-bold rounded-full flex items-center justify-center"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <button
            className="p-2 rounded-xl text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE SLIDE-DOWN MENU ── */}
      <div
        style={{
          maxHeight: mobileOpen ? "500px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
        className="md:hidden"
      >
        <div className="bg-white border-t border-gray-100">
          {/* User info header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-orange-50 border-b border-orange-100">
            <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md shadow-orange-200">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-lg font-bold">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="px-4 py-3 flex flex-col gap-1">
            <NavLink
              to="/home"
              className={mobileNavLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <Home className="w-4 h-4" />
              Home
            </NavLink>
            <NavLink
              to="/restaurants"
              className={mobileNavLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <Store className="w-4 h-4" />
              Restaurants
            </NavLink>
            <NavLink
              to="/search"
              className={mobileNavLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <Search className="w-4 h-4" />
              Search
            </NavLink>
            <NavLink
              to="/profile"
              className={mobileNavLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <User className="w-4 h-4" />
              My Profile
            </NavLink>

            {/* Divider */}
            <div className="my-1 border-t border-gray-100" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                         text-red-500 hover:bg-red-50 transition-all duration-200 w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
