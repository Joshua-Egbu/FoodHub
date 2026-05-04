// ============================================
// src/components/common/SkeletonCard.jsx
// ============================================
// A shimmering placeholder card shown while
// restaurant data is being fetched.
//
// This prevents the page from looking broken
// during loading — instead users see animated
// grey bars that hint at the content to come.
//
// Used on: Home, Restaurant List, Search
//
// Props:
//   count → how many skeleton cards to render
//           defaults to 1 if not provided
// ============================================

import React from "react";

// ── SINGLE SKELETON CARD ────────────────────
// Mimics the shape of a RestaurantCard
const SingleSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    {/* Image placeholder */}
    <div className="h-48 bg-gray-200" />

    {/* Content placeholder */}
    <div className="p-4 space-y-3">
      {/* Cuisine badge placeholder */}
      <div className="h-5 w-20 bg-gray-200 rounded-full" />

      {/* Restaurant name placeholder — wider */}
      <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />

      {/* Address placeholder — narrower */}
      <div className="h-4 w-1/2 bg-gray-200 rounded-lg" />

      {/* Bottom row — rating + delivery time */}
      <div className="flex items-center justify-between pt-1">
        <div className="h-4 w-16 bg-gray-200 rounded-lg" />
        <div className="h-4 w-16 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);

// ── SKELETON CARD EXPORT ────────────────────
// Renders 'count' number of skeleton cards
// Usage: <SkeletonCard count={6} />
const SkeletonCard = ({ count = 1 }) => {
  // Array.from creates an array of 'count' length
  // so we can map over it and render that many skeletons
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </>
  );
};

// ── SKELETON ROW ────────────────────────────
// For horizontal scrolling sections like Top Rated
// Same card but sized for a horizontal row
export const SkeletonCardRow = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden
                     shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="h-40 bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded-full" />
            <div className="h-4 w-3/4 bg-gray-200 rounded-lg" />
            <div className="h-3 w-1/2 bg-gray-200 rounded-lg" />
            <div className="flex justify-between">
              <div className="h-3 w-12 bg-gray-200 rounded-lg" />
              <div className="h-3 w-12 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
