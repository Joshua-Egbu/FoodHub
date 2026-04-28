import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  Star,
  Users,
  X,
} from "lucide-react";

// ── NAV ITEMS ──────────────────────────────
// Add new admin pages here and they'll
// automatically appear in the sidebar
const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Restaurants",
    path: "/admin/restaurants",
    icon: <Store className="w-5 h-5" />,
  },
  {
    label: "Menu Items",
    path: "/admin/menu",
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
    icon: <Star className="w-5 h-5" />,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <Users className="w-5 h-5" />,
  },
];

// ── PROPS ───────────────────────────────────
// isOpen     → whether sidebar is visible on mobile
// onClose    → function to close sidebar on mobile
const AdminSidebar = ({ isOpen, onClose }) => {
  // Active link styling
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
        : "text-gray-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <>
      {/* ── MOBILE OVERLAY ── */}
      {/* Dark backdrop behind sidebar on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-700
          z-40 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-700">
          <span className="text-white font-semibold text-sm">Navigation</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 mb-3">
            Management
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
              onClick={onClose} // close mobile sidebar after clicking a link
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom info */}
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-gray-500 text-center">
            FoodHub Admin v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
