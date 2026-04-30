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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Fix 1: Skip fetchProfile on SIGNED_IN event because
        // login() already fetches it explicitly. Fetching here
        // too causes a redundant duplicate network call (~1-2s wasted).
        // We only fetch profile for other events like TOKEN_REFRESHED
        // or when the app loads with an existing session (INITIAL_SESSION).
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
  // Called from Login.jsx when form is submitted.
  // Fix 2: Navigate immediately after auth succeeds (1 call),
  // then load the profile in the background (non-blocking).
  // This cuts redirect wait time from 3 calls down to 1.
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await signIn(email, password);

      // Navigate immediately — don't wait for profile fetch
      // We know new users are always 'user' role
      // We check stored profile or default to /home,
      // then correct if needed once profile loads
      const tempNavigate = data.user ? "/home" : "/login";

      // Fetch profile in background (non-blocking)
      fetchProfile(data.user.id).then((profileData) => {
        // Show welcome toast once profile is ready
        toast.success(`Welcome back, ${profileData?.full_name || "User"}!`);
        // Correct navigation if user is actually admin
        if (profileData?.role === "admin") {
          navigate("/admin/dashboard");
        }
      });

      // Navigate immediately after just 1 Supabase call
      navigate(tempNavigate);
    } catch (err) {
      toast.error(
        err.message || "Login failed. Please check your credentials.",
      );
      throw err;
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
