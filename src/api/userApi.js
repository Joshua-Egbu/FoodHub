//  ← getProfile, updateProfile, getAllUsers, deleteUser
// ============================================
// src/api/userApi.js
// ============================================
// All user/profile related Supabase calls.
// Profile data lives in our custom 'profiles'
// table, separate from Supabase's auth.users.
// ============================================

import supabase from "../supabaseClient";

// ── GET PROFILE ─────────────────────────────
// Fetches a single user's profile by their ID.
// Same as getProfile in authApi — kept here
// for use in admin and profile pages.
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

// ── UPDATE PROFILE ──────────────────────────
// Updates editable fields on a user's profile.
// Called from Profile page when user saves changes.
//
// updateData can include:
//   full_name, phone, avatar_url
// NOTE: email changes go through Supabase Auth
//       not directly through this table
export const updateProfile = async (userId, updateData) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ── GET ALL USERS ───────────────────────────
// Admin only — returns every user profile.
// Used on the Manage Users admin page.
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ── DEACTIVATE USER ─────────────────────────
// Admin only — sets is_active to false.
// Deactivated users can still log in but
// we can check this flag to restrict access.
// Safer than deleting — data is preserved.
export const deactivateUser = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_active: false })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ── REACTIVATE USER ─────────────────────────
// Admin only — re-enables a deactivated account.
export const reactivateUser = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_active: true })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ── DELETE USER ─────────────────────────────
// Admin only — permanently removes a user profile.
// Note: this only removes the profiles row.
// The auth.users row requires Supabase Admin API
// which needs the service role key — not safe
// to use in frontend. For school project, deleting
// the profile row is sufficient demonstration.
export const deleteUser = async (userId) => {
  const { error } = await supabase.from("profiles").delete().eq("id", userId);

  if (error) throw error;
};
