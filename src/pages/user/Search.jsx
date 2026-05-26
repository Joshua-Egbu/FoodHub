// ============================================
// src/pages/user/Search.jsx
// ============================================
// Live search page for restaurants.
// Reads initial query from the URL so links
// like /search?q=pizza and /search?cuisine=Nigerian
// work directly from Home page category clicks.
//
// Features:
//   - Large search input at top (autofocused)
//   - Debounced search — waits 400ms after typing
//     stops before hitting Supabase
//   - Cuisine filter pills
//   - Results grid with RestaurantCard
//   - Empty state with helpful message
//   - Skeleton loaders during search
// ============================================

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search as SearchIcon,
  X,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { searchRestaurants, getAllRestaurants } from "../../api/restaurantApi";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import SkeletonCard from "../../components/common/SkeletonCard";

// ── DEBOUNCE HOOK ───────────────────────────
// Delays updating a value until the user stops
// typing for 'delay' milliseconds.
// Without this we'd make a Supabase call on
// every single keystroke the user types.
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

// ── CUISINE FILTER OPTIONS ──────────────────
const cuisineFilters = [
  "All",
  "Nigerian",
  "Burgers",
  "Pizza",
  "Chinese",
  "Japanese",
  "Mexican",
  "Lebanese",
  "Healthy",
  "Grills",
  "Bakery",
  "Street Food",
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── STATE ───────────────────────────────────
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCuisine, setActiveCuisine] = useState(
    searchParams.get("cuisine") || "All",
  );
  const [results, setResults] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 400);

  // ── LOAD ALL RESTAURANTS ON MOUNT ──────────
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const data = await getAllRestaurants();
        setAllRestaurants(data);

        const cuisineParam = searchParams.get("cuisine");
        const queryParam = searchParams.get("q");

        if (cuisineParam && cuisineParam !== "All") {
          const filtered = data.filter(
            (r) => r.cuisine.toLowerCase() === cuisineParam.toLowerCase(),
          );
          setResults(filtered);
          setHasSearched(true);
        } else if (!queryParam) {
          setResults(data);
          setHasSearched(true);
        }
      } catch (err) {
        setError("Failed to load restaurants. Please try again.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [searchParams]);

  // ── SEARCH WHEN DEBOUNCED QUERY CHANGES ────
  useEffect(() => {
    if (allRestaurants.length === 0) return;

    const performSearch = async () => {
      const filterByCuisine = (data) => {
        if (activeCuisine === "All") return data;
        return data.filter(
          (r) => r.cuisine.toLowerCase() === activeCuisine.toLowerCase(),
        );
      };

      if (!debouncedQuery.trim()) {
        setResults(filterByCuisine(allRestaurants));
        setHasSearched(true);
        if (activeCuisine !== "All") {
          setSearchParams({ cuisine: activeCuisine });
        } else {
          setSearchParams({});
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await searchRestaurants(debouncedQuery.trim());
        setResults(filterByCuisine(data));
        setHasSearched(true);

        const params = { q: debouncedQuery.trim() };
        if (activeCuisine !== "All") params.cuisine = activeCuisine;
        setSearchParams(params);
      } catch (err) {
        setError("Search failed. Please try again.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, activeCuisine, allRestaurants, setSearchParams]);

  // ── HANDLE CUISINE FILTER ───────────────────
  const handleCuisineFilter = (cuisine) => {
    setActiveCuisine(cuisine);
  };

  // ── CLEAR EVERYTHING ────────────────────────
  const clearSearch = () => {
    setQuery("");
    setActiveCuisine("All");
    setSearchParams({});
    setResults(allRestaurants);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ── STICKY SEARCH HEADER ── */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          {/* Search input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants or cuisine..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-amber-50 border border-gray-200
                         rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none
                         focus:ring-2 focus:ring-orange-400 focus:border-transparent
                         text-base transition-all"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Cuisine filter pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {cuisineFilters.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => handleCuisineFilter(cuisine)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
                            border transition-all duration-200 ${
                              activeCuisine === cuisine
                                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500"
                            }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULTS SECTION ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Results count + active filter */}
        {hasSearched && !loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">
              {results.length === 0
                ? "No results found"
                : `${results.length} result${results.length !== 1 ? "s" : ""}${
                    query ? ` for "${query}"` : ""
                  }${activeCuisine !== "All" ? ` in ${activeCuisine}` : ""}`}
            </p>

            {activeCuisine !== "All" && (
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-500 font-medium">
                  {activeCuisine}
                </span>
                <button
                  onClick={() => handleCuisineFilter("All")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200
                          rounded-2xl text-red-600 mb-6"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard count={6} />
          </div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3
              className="text-xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              No restaurants found
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {query
                ? `We couldn't find any restaurants matching "${query}".`
                : `No restaurants in the ${activeCuisine} category yet.`}
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white
                         font-semibold rounded-xl transition-colors text-sm"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
