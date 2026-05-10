// ============================================
// src/components/layout/Footer.jsx
// ============================================
// Shared footer used on all user-facing pages.
// NOT used on admin pages (they have no footer).
// ============================================

import React from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* ── TOP SECTION ── */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            <span
              className="text-lg font-bold text-white"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              FoodHub
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">
            Nigeria's favourite multi-vendor food delivery platform. Order from
            the best restaurants near you.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
            Quick Links
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/home"
                className="hover:text-orange-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/restaurants"
                className="hover:text-orange-400 transition-colors"
              >
                Restaurants
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="hover:text-orange-400 transition-colors"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:text-orange-400 transition-colors"
              >
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / info */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
            Support
          </p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>📧 support@foodhub.com</li>
            <li>📞 +234 800 000 0000</li>
            <li>📍 Lagos, Nigeria</li>
          </ul>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-gray-800 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © 2025 FoodHub. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 text-orange-500 fill-orange-500" /> by
            J-D.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
