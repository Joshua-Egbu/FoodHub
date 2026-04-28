// ============================================
// src/context/AuthContext.jsx
// ============================================
// This is the BRAIN of authentication.
// It wraps the entire app and makes user data
// available everywhere without prop drilling.
//
// Any component can call useAuth() to get:
//   - user      → the logged in user
//   - profile   → their profile (with role)
//   - loading   → whether auth is being checked
//   - login()   → function to log in
//   - logout()  → function to log out
//   - signup()  → function to register
// ============================================

import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import supabase from "../supabaseClient";
import { signIn, signOut, signUp, getProfile } from "../api/authApi";

// Step 1: Create the context object
// This is what other components will subscribe to
const AuthContext = createContext({});

// Step 2: Create the Provider component
// This wraps the whole app in App.jsx
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ── STATE ──────────────────────────────────
  const [user, setUser] = useState(null); // Supabase auth user object
  const [profile, setProfile] = useState(null); // Our profiles table row
  const [loading, setLoading] = useState(true); // True while checking session

  // ── FETCH PROFILE HELPER ───────────────────
  // Reusable function to load profile from DB
  const fetchProfile = async (userId) => {
    try {
      const profileData = await getProfile(userId);
      setProfile(profileData);
      return profileData;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  };

  // ── SESSION LISTENER ───────────────────────
  // This runs once when the app loads.
  // Supabase automatically checks localStorage
  // for a saved session and restores it.
  // onAuthStateChange fires whenever:
  //   - User logs in
  //   - User logs out
  //   - Session expires
  useEffect(() => {
    // Get the current session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for future auth changes (login/logout)
    // NOTE: We do NOT call fetchProfile here on SIGNED_IN because
    // login() already calls it explicitly. Calling it here too would
    // trigger a 3rd redundant network round-trip on every login.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Only re-fetch profile for token refreshes or if switching users,
        // not for SIGNED_IN (login() already fetched it).
        if (event !== "SIGNED_IN") {
          await fetchProfile(session.user.id);
        }
      } else {
        // User logged out — clear everything
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // Cleanup: unsubscribe when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // ── LOGIN FUNCTION ─────────────────────────
  // Called from Login.jsx when form is submitted
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await signIn(email, password);

      // Use user_metadata from the JWT for an immediate role-based redirect
      // (no extra DB round-trip needed just to decide where to navigate)
      const metaRole = data.user?.user_metadata?.role;

      // Navigate right away — profile loads in the background
      if (metaRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }

      // Fetch the full profile in the background (non-blocking)
      // The onAuthStateChange SIGNED_IN skip means this is the only fetch
      fetchProfile(data.user.id).then((profileData) => {
        toast.success(`Welcome back, ${profileData?.full_name || "User"}!`);
        // If the metadata role was wrong/missing, redirect now with the real role
        if (profileData?.role === "admin" && metaRole !== "admin") {
          navigate("/admin/dashboard");
        }
      });
    } catch (err) {
      toast.error(
        err.message || "Login failed. Please check your credentials.",
      );
      throw err; // re-throw so Login.jsx can stop its loading spinner
    } finally {
      setLoading(false);
    }
  };

  // ── SIGNUP FUNCTION ────────────────────────
  // Called from Signup.jsx when form is submitted
  const signup = async (email, password, fullName) => {
    try {
      setLoading(true);
      await signUp(email, password, fullName);
      toast.success("Account created! Welcome to FoodHub 🎉");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Signup failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── LOGOUT FUNCTION ────────────────────────
  // Called from Navbar when user clicks logout
  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed.");
      console.log(err);
    }
  };

  // ── CONTEXT VALUE ──────────────────────────
  // Everything we want to share with the app
  const value = {
    user,
    profile,
    loading,
    login,
    logout,
    signup,
    isAdmin: profile?.role === "admin", // convenient boolean
    isAuthenticated: !!user, // true if user is logged in
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Step 3: Custom hook for easy access
// Instead of: const { user } = useContext(AuthContext)
// Components just do: const { user } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default AuthContext;
