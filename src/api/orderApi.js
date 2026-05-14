// ← createOrder, getUserOrders, getAllOrders
// ============================================
// src/api/orderApi.js
// ============================================
// All order-related Supabase calls.
//
// Orders table structure:
//   id, user_id, restaurant_id, items (jsonb),
//   total_amount, delivery_address, delivery_fee,
//   status, payment_reference, created_at
// ============================================

import supabase from "../supabaseClient";

// ── CREATE ORDER ────────────────────────────
// Called from Checkout page after payment succeeds.
// Saves the full order to Supabase.
//
// orderData shape:
// {
//   user_id, restaurant_id, items,
//   total_amount, delivery_address,
//   delivery_fee, payment_reference
// }
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        ...orderData,
        status: "confirmed", // default status after payment
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ── GET USER ORDERS ─────────────────────────
// Fetches all orders belonging to one user.
// Joins with restaurants table to get the name.
// Used on the Profile page order history section.
export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      restaurants (name, image_url)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false }); // newest first

  if (error) throw error;
  return data;
};

// ── GET ALL ORDERS ──────────────────────────
// Admin only — fetches every order on the platform.
// Joins user profile and restaurant for display.
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      restaurants (name),
      profiles (full_name, email)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ── UPDATE ORDER STATUS ─────────────────────
// Admin only — changes order status.
// status options: 'pending', 'confirmed', 'delivered'
export const updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
