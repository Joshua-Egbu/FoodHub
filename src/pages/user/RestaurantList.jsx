// ============================================
// src/pages/user/RestaurantList.jsx
// ============================================
// Shows all restaurants with category filtering.
// Fetches once on mount, filters client-side
// so no extra network calls when changing filter.
// ============================================

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../../api/restaurantApi";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import SkeletonCard from "../../components/common/SkeletonCard";

// All available cuisine filters
const FILTERS = [
  "All",
  "Nigerian",
  "Burgers",
  "Pizza",
  "Japanese",
  "Chinese",
  "Mexican",
  "Lebanese",
  "Healthy",
  "Grills",
  "Bakery",
  "Street Food",
];

const RestaurantList = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ── FETCH ALL RESTAURANTS ONCE ──────────────
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError("Failed to load restaurants. Please try again.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // ── CLIENT-SIDE FILTERING ───────────────────
  // Filter is applied to the already-fetched data
  // No extra network call needed when changing filter
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesCuisine = activeFilter === "All" || r.cuisine === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCuisine && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ── PAGE HERO ── */}
      <div className="bg-gray-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Explore
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            All Restaurants
          </h1>
          <p className="text-gray-400">
            {loading
              ? "Loading..."
              : `${restaurants.length} restaurants available`}
          </p>

          {/* Inline search bar */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name or cuisine..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20
                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                         focus:ring-2 focus:ring-orange-400 text-sm backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* ── FILTER PILLS ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
                           transition-all duration-200 whitespace-nowrap ${
                             activeFilter === filter
                               ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                               : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                           }`}
              >
                {filter}
                {/* Show count next to active filter */}
                {activeFilter === filter && !loading && (
                  <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                    {filteredRestaurants.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESTAURANT GRID ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error state */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-600
                          rounded-xl p-4 mb-6 text-sm"
          >
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <SkeletonCard count={9} />
          ) : filteredRestaurants.length === 0 ? (
            // Empty state
            <div className="col-span-3 text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-700 font-bold text-lg">
                No restaurants found
              </p>
              <p className="text-gray-400 text-sm mt-2 mb-4">
                {activeFilter !== "All"
                  ? `No ${activeFilter} restaurants available right now.`
                  : "No restaurants match your search."}
              </p>
              <button
                onClick={() => {
                  setActiveFilter("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold
                           rounded-xl hover:bg-orange-600 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
