// ← login, signup, logout

import supabase from "../supabaseClient";

// All authentication-related API calls live here.

// SIGN UP
// Creates a brand new user in Supabase Auth

export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, // this gets passed to the trigger
      },
    },
  });

  if (error) throw error; // throw so AuthContext can catch and show the error
  return data;
};

// SIGN IN
// Logs in an existing user with email + password
// Supabase automatically stores the session in localStorage so user stays logged in
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// SIGN OUT
// Clears the session from Supabase + localStorage
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// GET CURRENT USER
// Returns the currently logged-in user object
// Returns null if no one is logged in
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// GET PROFILE
// Fetches the user's row from our profiles table
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles") // from the profiles table
    .select("*") // select all columns
    .eq("id", userId) // where id matches the logged-in user
    .single(); // we expect only one row back

  if (error) throw error;
  return data;
};
