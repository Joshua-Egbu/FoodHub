// ============================================
// src/pages/user/Home.jsx
// ============================================
// The main landing page for logged-in users.
//
// Sections:
//   1. Hero — search bar + CTA buttons
//   2. Categories — horizontal scrollable pills
//   3. Top Rated — horizontal scrollable cards
//   4. All Restaurants — responsive grid
//
// Data flow:
//   useEffect → fetch restaurants from Supabase
//   while loading → show SkeletonCard placeholders
//   on success → render RestaurantCard components
//   on error → show error message
// ============================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, AlertCircle } from "lucide-react";
import { getAllRestaurants, getTopRated } from "../../api/restaurantApi";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import SkeletonCard, {
  SkeletonCardRow,
} from "../../components/common/SkeletonCard";
import { useAuth } from "../../context/AuthContext";

// ── CUISINE CATEGORIES ──────────────────────
const categories = [
  { emoji: "🍲", label: "Nigerian" },
  { emoji: "🍔", label: "Burgers" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🍣", label: "Japanese" },
  { emoji: "🌮", label: "Mexican" },
  { emoji: "🥗", label: "Healthy" },
  { emoji: "🍜", label: "Chinese" },
  { emoji: "🫓", label: "Lebanese" },
  { emoji: "🔥", label: "Grills" },
  { emoji: "🧁", label: "Bakery" },
];

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // ── STATE ───────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);
  const [error, setError] = useState(null);

  // ── FETCH DATA ──────────────────────────────
  // Runs once when the component first mounts
  // Fetches both all restaurants and top rated in parallel
  // Promise.all runs both calls at the same time
  // instead of waiting for one to finish before starting the other
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run both fetches at the same time — faster than sequential
        const [allData, topData] = await Promise.all([
          getAllRestaurants(),
          getTopRated(),
        ]);
        setAllRestaurants(allData);
        setTopRated(topData);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again.");
      } finally {
        // Always stop loading even if there was an error
        setLoadingAll(false);
        setLoadingTop(false);
      }
    };

    fetchData();
  }, []); // empty array = run once on mount only

  // ── HANDLE SEARCH SUBMIT ────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // ── HANDLE CATEGORY CLICK ───────────────────
  const handleCategoryClick = (label) => {
    navigate(`/search?cuisine=${encodeURIComponent(label)}`);
  };

  // ── GET GREETING ────────────────────────────
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section
        className="relative bg-cover bg-center py-20 px-6"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&auto=format&fit=crop')`,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/40" />

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          {/* Personalised greeting */}
          <p className="text-orange-300 font-medium mb-2">
            {getGreeting()}, {profile?.full_name?.split(" ")[0] || "there"} 👋
          </p>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            What are you
            <span className="text-orange-400"> craving today?</span>
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Order from hundreds of restaurants near you
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants or cuisine..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-800
                           placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-orange-400 shadow-xl text-base"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold
                         rounded-2xl transition-all duration-200 shadow-xl whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Quick action buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => navigate("/restaurants")}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                         border border-white/30 text-white text-sm font-medium
                         rounded-xl transition-all duration-200"
            >
              Browse All Restaurants
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("top-rated")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600
                         text-white text-sm font-medium rounded-xl transition-all duration-200"
            >
              Top Rated ⭐
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES ROW
      ══════════════════════════════════════ */}
      <section className="py-8 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Horizontal scroll container */}
          {/* scrollbar-hide hides the ugly scrollbar on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleCategoryClick(cat.label)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-50
                           hover:bg-orange-500 hover:text-white border border-gray-200
                           hover:border-orange-500 rounded-full text-sm font-medium
                           text-gray-700 transition-all duration-200 whitespace-nowrap"
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* ══════════════════════════════════════
            TOP RATED SECTION
        ══════════════════════════════════════ */}
        <section id="top-rated">
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-1">
                Highly Recommended
              </p>
              <h2
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Top Rated Restaurants ⭐
              </h2>
            </div>
            <button
              onClick={() => navigate("/restaurants")}
              className="flex items-center gap-1 text-sm text-orange-500 font-semibold
                         hover:text-orange-600 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal scrollable row */}
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-2 px-2">
            {loadingTop ? (
              // Show 4 skeleton cards while loading
              <SkeletonCardRow count={4} />
            ) : error ? (
              <div className="flex items-center gap-2 text-red-500 py-4">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            ) : topRated.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">
                No top rated restaurants yet.
              </p>
            ) : (
              topRated.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  horizontal={true} // use the compact horizontal card style
                />
              ))
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            ALL RESTAURANTS SECTION
        ══════════════════════════════════════ */}
        <section>
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-1">
                Explore
              </p>
              <h2
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                All Restaurants 🍽️
              </h2>
            </div>
            {/* Live count */}
            {!loadingAll && (
              <span className="text-sm text-gray-400">
                {allRestaurants.length} restaurants
              </span>
            )}
          </div>

          {/* Error state */}
          {error && (
            <div
              className="flex items-center gap-2 text-red-500 bg-red-50
                            border border-red-200 rounded-xl p-4 mb-4"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Restaurant grid */}
          {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loadingAll ? (
              // Show 6 skeleton cards while loading
              <SkeletonCard count={6} />
            ) : allRestaurants.length === 0 && !error ? (
              // Empty state
              <div className="col-span-3 text-center py-16">
                <p className="text-4xl mb-3">🍽️</p>
                <p className="text-gray-500 font-medium">
                  No restaurants found.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Check back soon — more restaurants are joining FoodHub.
                </p>
              </div>
            ) : (
              allRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  // horizontal={false} is the default — vertical grid card
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
