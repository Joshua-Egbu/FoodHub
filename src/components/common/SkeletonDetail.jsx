// ============================================
// src/components/common/SkeletonDetail.jsx
// ============================================
// Full-page skeleton shown while restaurant
// detail data is loading.
// Mimics the two-column layout of the detail page.
// ============================================

import React from "react";

const SkeletonDetail = () => {
  return (
    <div className="animate-pulse">
      {/* Hero banner skeleton */}
      <div className="h-64 md:h-80 bg-gray-200 w-full" />

      {/* Info strip skeleton */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex gap-6">
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-28 bg-gray-200 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Two column body */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Left column — menu */}
        <div className="flex-1 space-y-8">
          {/* Category heading */}
          <div className="h-6 w-32 bg-gray-200 rounded-lg" />

          {/* Menu items */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />
                <div className="h-4 w-full bg-gray-200 rounded-lg" />
                <div className="h-4 w-1/2 bg-gray-200 rounded-lg" />
                <div className="h-6 w-20 bg-gray-200 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Right column — cart panel */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div className="h-6 w-28 bg-gray-200 rounded-lg" />
            <div className="h-px bg-gray-200" />
            <div className="h-4 w-full bg-gray-200 rounded-lg" />
            <div className="h-4 w-full bg-gray-200 rounded-lg" />
            <div className="h-4 w-2/3 bg-gray-200 rounded-lg" />
            <div className="h-px bg-gray-200" />
            <div className="h-10 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDetail;
