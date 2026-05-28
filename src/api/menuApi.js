// ← getByRestaurant, addItem, updateItem, deleteItem
// ============================================
// src/api/menuApi.js
// ============================================
import supabase from "../supabaseClient";

// Get all menu items for a restaurant
export const getMenuByRestaurant = async (restaurantId) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("category", { ascending: true });
  if (error) throw error;
  return data;
};

// Get a single menu item
export const getMenuItemById = async (id) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// Create a new menu item
export const createMenuItem = async (item) => {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([item])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Update a menu item
export const updateMenuItem = async (id, updates) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Delete a menu item
export const deleteMenuItem = async (id) => {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
};

// Toggle availability
export const toggleMenuItemAvailability = async (id, is_available) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update({ is_available })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Get all menu items (admin - across all restaurants)
export const getAllMenuItems = async () => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, restaurants(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};
