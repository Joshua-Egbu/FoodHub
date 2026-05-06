// ← getByRestaurant, addReview, deleteReview
// ============================================
// src/api/reviewApi.js
// ============================================
// All review-related Supabase calls.
// Reviews belong to a restaurant and a user.
// ============================================

import supabase from "../supabaseClient";

// ── GET REVIEWS BY RESTAURANT ───────────────
// Fetches all reviews for a specific restaurant
// Joins with profiles table to get reviewer name
// Orders newest first
export const getReviewsByRestaurant = async (restaurantId) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles (full_name, avatar_url)
    `,
    )
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ── ADD REVIEW ──────────────────────────────
// Inserts a new review row into the reviews table
// Also updates the restaurant's average rating
export const addReview = async (restaurantId, userId, rating, comment) => {
  // Step 1: Insert the review
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        restaurant_id: restaurantId,
        user_id: userId,
        rating,
        comment,
      },
    ])
    .select(
      `
      *,
      profiles (full_name, avatar_url)
    `,
    )
    .single();

  if (error) throw error;

  // Step 2: Recalculate and update restaurant average rating
  // We do this after every new review so rating stays current
  const { data: avgData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("restaurant_id", restaurantId);

  if (avgData && avgData.length > 0) {
    const avg = avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length;
    await supabase
      .from("restaurants")
      .update({ rating: Math.round(avg * 10) / 10 }) // round to 1 decimal
      .eq("id", restaurantId);
  }

  return data;
};

// ── DELETE REVIEW ───────────────────────────
// Admin only — permanently removes a review
// Called from the admin reviews management page
export const deleteReview = async (reviewId) => {
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) throw error;
};

// ── GET ALL REVIEWS ─────────────────────────
// Admin only — fetches every review across all restaurants
// Joins restaurant name and reviewer name for display
export const getAllReviews = async () => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles (full_name),
      restaurants (name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
