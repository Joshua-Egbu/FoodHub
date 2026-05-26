// ← getAll, getById, create, update, delete
// ============================================
// src/api/restaurantApi.js
// ============================================
// All restaurant-related Supabase calls.
// We add functions here as we need them
// across different days/features.
//
// Current functions:
//   getAllRestaurants() → used on Home + Restaurant List
//   getTopRated()      → used on Home page
//
// Future functions added later:
//   getById()          → Day 9  (Restaurant Detail)
//   create()           → Day 22 (Admin)
//   update()           → Day 22 (Admin)
//   delete()           → Day 22 (Admin)
// ============================================

import supabase from "../supabaseClient";

// ── GET ALL RESTAURANTS ─────────────────────
// Fetches every active restaurant from the DB
// Orders by name alphabetically
// Only returns restaurants where is_active = true
export const getAllRestaurants = async () => {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*") // get all columns
    .eq("is_active", true) // only active restaurants
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

// ── GET TOP RATED ───────────────────────────
// Fetches restaurants with highest ratings
// Limited to 6 so it fits in a horizontal row
// Only includes restaurants with a rating set
export const getTopRated = async () => {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true)
    .not("rating", "is", null) // must have a rating
    .order("rating", { ascending: false }) // highest first
    .limit(6); // only top 6

  if (error) throw error;
  return data;
};

// ── GET DELIVERY INFO (lightweight) ─────────
// Fetches only the fields needed for Cart / Checkout
// (delivery_fee, delivery_time, name) — no joins.
// Much faster than getRestaurantById which loads
// all menu_items and reviews.
export const getRestaurantDeliveryInfo = async (id) => {
  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, delivery_fee, delivery_time")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// ── GET BY ID ───────────────────────────────
// Fetches a single restaurant with its menu items and reviews
// Used on the Restaurant Detail page (Day 9)
export const getRestaurantById = async (id) => {
  const { data, error } = await supabase
    .from("restaurants")
    .select(
      `
      *,
      menu_items (*),
      reviews (*)
    `,
    ) // joins menu_items and reviews automatically
    .eq("id", id)
    .single(); // expect exactly one row

  if (error) throw error;
  return data;
};

// ── SEARCH RESTAURANTS ──────────────────────
// Searches by name or cuisine using ilike (case-insensitive)
// Used on the Search page (Day 13)
export const searchRestaurants = async (query) => {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,cuisine.ilike.%${query}%`);

  if (error) throw error;
  return data;
};

// ── CREATE RESTAURANT ───────────────────────
// Admin only — adds a new restaurant (Day 22)
export const createRestaurant = async (restaurantData) => {
  const { data, error } = await supabase
    .from("restaurants")
    .insert([restaurantData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ── UPDATE RESTAURANT ───────────────────────
// Admin only — updates an existing restaurant (Day 22)
export const updateRestaurant = async (id, restaurantData) => {
  const { data, error } = await supabase
    .from("restaurants")
    .update(restaurantData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ── DELETE RESTAURANT ───────────────────────
// Admin only — soft delete by setting is_active = false (Day 22)
// We never hard delete — we just deactivate
export const deleteRestaurant = async (id) => {
  const { error } = await supabase
    .from("restaurants")
    .update({ is_active: false })
    .eq("id", id);

  if (error) throw error;
};
