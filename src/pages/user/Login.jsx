import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  // ── FORM STATE ─────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // error message to display

  // ── HANDLE SUBMIT ──────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page from refreshing
    setError(""); // clear any previous error
    setIsLoading(true);

    try {
      await login(email, password);
      // login() in AuthContext handles redirect
    } catch (err) {
      // login() already shows a toast, but we
      // also show inline error on the form
      setError("Invalid email or password. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT SIDE ── Food hero image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop')`,
        }}
      >
        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 to-black/60" />

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-orange-400" />
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              FoodHub
            </span>
          </div>

          {/* Tagline */}
          <div>
            <h1
              className="text-5xl font-bold leading-tight mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Hungry?
              <br />
              <span className="text-orange-400">We've got you.</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Order from the best restaurants near you, delivered fast.
            </p>
          </div>

          {/* Bottom quote */}
          <p className="text-gray-400 text-sm">
            "Good food is the foundation of genuine happiness."
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-amber-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo (hidden on desktop) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <UtensilsCrossed className="w-7 h-7 text-orange-500" />
            <span
              className="text-xl font-bold text-gray-800"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              FoodHub
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Welcome back
            </h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                {/* Icon inside input */}
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

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  // Toggle between text and password to show/hide
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                             text-gray-800 placeholder-gray-400 transition-all"
                />
                {/* Show/hide password toggle button */}
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300
                         text-white font-semibold rounded-xl transition-all duration-200
                         flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
            >
              {isLoading ? (
                <>
                  {/* Loading spinner */}
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          {/*
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

           <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-xs font-semibold text-orange-700 mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1">
              <p className="text-xs text-orange-600">
                👤 User: <span className="font-mono">user@foodhub.com</span> /{" "}
                <span className="font-mono">user123</span>
              </p>
              <p className="text-xs text-orange-600">
                🔑 Admin: <span className="font-mono">admin@foodhub.com</span> /{" "}
                <span className="font-mono">admin123</span>
              </p>
            </div>
          </div> */}

          {/* Link to signup */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
