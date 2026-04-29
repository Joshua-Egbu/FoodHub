// ============================================
// src/pages/user/Signup.jsx
// ============================================
// Registration page. Same split-screen layout
// as Login but with more form fields.
// ============================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();

  // ── FORM STATE ─────────────────────────────
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ── HANDLE SUBMIT ──────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation before hitting Supabase
    if (fullName.trim().length < 2) {
      return setError("Please enter your full name.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setIsLoading(true);
    try {
      await signup(email, password, fullName);
      // signup() in AuthContext handles redirect to /home
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── Food hero image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 to-black/60" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-orange-400" />
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              FoodHub
            </span>
          </div>

          <div>
            <h1
              className="text-5xl font-bold leading-tight mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Join us today.
              <br />
              <span className="text-orange-400">Eat happy.</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Discover hundreds of restaurants. Order in minutes.
            </p>
          </div>

          <p className="text-gray-400 text-sm">
            "Food is our common ground, a universal experience."
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-amber-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <UtensilsCrossed className="w-7 h-7 text-orange-500" />
            <span
              className="text-xl font-bold text-gray-800"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              FoodHub
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Create account
            </h2>
            <p className="text-gray-500">
              Start ordering your favourite meals today
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  disabled={isLoading}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                             text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                             text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                             text-gray-800 placeholder-gray-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  disabled={isLoading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                             text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300
                         text-white font-semibold rounded-xl transition-all duration-200
                         flex items-center justify-center gap-2 shadow-lg shadow-orange-200 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Link to login */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
