// ============================================
// src/api/reviewApi.js
// ============================================
// All review-related Supabase calls.
//
// Reviews table structure:
//   id, restaurant_id, user_id, rating,
//   comment, created_at
// ============================================

import supabase from "../supabaseClient";

// ── GET REVIEWS BY RESTAURANT ───────────────
// Fetches all reviews for one restaurant.
// Joins with profiles to get reviewer's name.
// Used on Restaurant Detail page.
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
// Inserts a new review row.
// Called from AddReviewForm on Restaurant Detail.
//
// reviewData shape:
// { restaurant_id, user_id, rating, comment }
export const addReview = async (reviewData) => {
  const { data, error } = await supabase
    .from("reviews")
    .insert([reviewData])
    .select(
      `
      *,
      profiles (full_name, avatar_url)
    `,
    )
    .single();

  if (error) throw error;
  return data;
};

// ── DELETE REVIEW ───────────────────────────
// Admin only — hard deletes a review.
// Used on Manage Reviews admin page.
export const deleteReview = async (reviewId) => {
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) throw error;
};

// ── GET ALL REVIEWS ─────────────────────────
// Admin only — gets every review across all restaurants.
// Joins restaurant name and reviewer name for display.
export const getAllReviews = async () => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      restaurants (name),
      profiles (full_name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ── UPDATE RESTAURANT RATING ─────────────────
// Recalculates and updates the restaurant's
// average rating after a new review is added.
// Called internally after addReview succeeds.
export const updateRestaurantRating = async (restaurantId) => {
  // Get all ratings for this restaurant
  const { data: reviews, error: fetchError } = await supabase
    .from("reviews")
    .select("rating")
    .eq("restaurant_id", restaurantId);

  if (fetchError) throw fetchError;

  // Calculate new average
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const rounded = Math.round(avg * 10) / 10; // round to 1 decimal

  // Update the restaurant's rating column
  const { error: updateError } = await supabase
    .from("restaurants")
    .update({ rating: rounded })
    .eq("id", restaurantId);

  if (updateError) throw updateError;
};
