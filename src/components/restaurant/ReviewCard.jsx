// ============================================
// src/components/restaurant/ReviewCard.jsx
// ============================================
// Displays a single review with:
//   - Avatar circle with reviewer's initial
//   - Star rating
//   - Comment text
//   - Relative time (e.g. "3 days ago")
//
// Props:
//   review      → the review object from Supabase
//   onDelete    → optional function for admin delete
//   isAdmin     → shows delete button if true
// ============================================

import React from "react";
import { Star, Trash2 } from "lucide-react";

// ── RELATIVE TIME HELPER ────────────────────
// Converts a date string into "X days ago" format
// e.g. "2025-04-01" → "3 days ago"
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// ── STAR ROW ────────────────────────────────
const StarRow = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3.5 h-3.5 ${
          star <= rating
            ? "text-amber-400 fill-amber-400"
            : "text-gray-200 fill-gray-200"
        }`}
      />
    ))}
  </div>
);

// ── AVATAR COLOURS ──────────────────────────
// Cycles through colours based on first letter
// so each reviewer gets a consistent colour
const avatarColors = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
];
const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

const ReviewCard = ({ review, onDelete, isAdmin = false }) => {
  // Get reviewer name from joined profile data
  // If no profile (anonymous/seeded review) show "Anonymous"
  const reviewerName = review.profiles?.full_name || "Anonymous";
  const initial = reviewerName.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      {/* ── HEADER: Avatar + Name + Date ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar circle */}
          <div
            className={`w-9 h-9 rounded-full ${getAvatarColor(reviewerName)}
                           flex items-center justify-center flex-shrink-0`}
          >
            {review.profiles?.avatar_url ? (
              <img
                src={review.profiles.avatar_url}
                alt={reviewerName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold">{initial}</span>
            )}
          </div>

          {/* Name + date */}
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {reviewerName}
            </p>
            <p className="text-xs text-gray-400">
              {getRelativeTime(review.created_at)}
            </p>
          </div>
        </div>

        {/* Right side: stars + optional delete button */}
        <div className="flex items-center gap-2">
          <StarRow rating={review.rating} />

          {/* Admin delete button */}
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50
                         rounded-lg transition-all duration-200 ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── COMMENT TEXT ── */}
      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
