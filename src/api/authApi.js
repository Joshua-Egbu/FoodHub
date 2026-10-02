// ============================================
// src/api/authApi.js
// ============================================
// All authentication-related API calls live
// here. This file talks directly to Supabase
// Auth. The AuthContext will use these functions.
// ============================================

import supabase from "../supabaseClient";

// ── SIGN UP ─────────────────────────────────
// Creates a brand new user in Supabase Auth
// Also manually creates the profile row as a
// fallback in case the trigger doesn't fire
export const signUp = async (email, password, fullName) => {
  // Step 1: Create the auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  // Step 2: Manually insert profile row as fallback
  // upsert = insert if not exists, update if it does
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email: email,
      full_name: fullName,
      role: "user",
      is_active: true,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
    }
  }

  return data;
};

// ── SIGN IN ─────────────────────────────────
// Logs in an existing user with email + password
// Supabase automatically stores the session
// in localStorage so user stays logged in
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// ── SIGN OUT ────────────────────────────────
// Clears the session from Supabase + localStorage
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ── GET CURRENT USER ────────────────────────
// Returns the currently logged-in user object
// Returns null if no one is logged in
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// ── GET PROFILE ─────────────────────────────
// Fetches the user's row from our profiles table
// This gives us their role, phone, avatar etc.
// The built-in auth user object doesn't have these
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles") // from the profiles table
    .select("*") // select all columns
    .eq("id", userId) // where id matches the logged-in user
    .maybeSingle(); // a deleted profile is a valid missing result

  if (error) throw error;
  return data;
};
