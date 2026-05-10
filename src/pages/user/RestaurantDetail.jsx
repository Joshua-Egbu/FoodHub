// ============================================
// src/pages/user/RestaurantDetail.jsx
// ============================================
// Detailed view of a single restaurant.
// Reads the restaurant ID from the URL params.
//
// Layout:
//   Left  (65%) → restaurant info, menu, reviews
//   Right (35%) → sticky cart panel
//
// Data:
//   getRestaurantById() returns restaurant +
//   menu_items + reviews in a single Supabase call
// ============================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Bike,
  MapPin,
  ChevronLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { getRestaurantById } from "../../api/restaurantApi";
import { getReviewsByRestaurant } from "../../api/reviewApi";
import MenuItemCard from "../../components/restaurant/MenuItemCard";
import ReviewCard from "../../components/restaurant/ReviewCard";
import AddReviewForm from "../../components/restaurant/AddReviewForm";
import SkeletonDetail from "../../components/common/SkeletonDetail";
import useCart from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";

// ── GROUP MENU ITEMS BY CATEGORY ────────────
// Converts flat array into object grouped by category
// e.g. { Starters: [...], 'Main Course': [...], Drinks: [...] }
const groupByCategory = (items) => {
  return items.reduce((groups, item) => {
    const cat = item.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
    return groups;
  }, {});
};

// ── STAR RATING DISPLAY ─────────────────────
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-4 h-4 ${
          s <= Math.round(rating || 0)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-300 fill-gray-300"
        }`}
      />
    ))}
    <span className="text-sm text-gray-600 ml-1">
      {rating?.toFixed(1) || "No rating"}
    </span>
  </div>
);

const RestaurantDetail = () => {
  const { id } = useParams(); // get restaurant ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    cartRestaurantId,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCart();

  // ── STATE ───────────────────────────────────
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // ── FETCH RESTAURANT DATA ───────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant + menu items in one call
        const data = await getRestaurantById(id);
        setRestaurant(data);
        setMenuItems(data.menu_items || []);

        // Fetch reviews separately so they include profile data
        const reviewData = await getReviewsByRestaurant(id);
        setReviews(reviewData);

        // Set the first category as active by default
        const grouped = groupByCategory(data.menu_items || []);
        const firstCat = Object.keys(grouped)[0];
        setActiveCategory(firstCat);
      } catch (err) {
        console.error(err);
        setError("Restaurant not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── HANDLE CATEGORY CLICK ───────────────────
  // Sets the active category AND scrolls to it
  // offsetTop accounts for the fixed navbar height (80px)
  // plus a little extra breathing room (16px)
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);

    const element = document.getElementById(`category-${cat}`);
    if (element) {
      const navbarHeight = 80 + 16; // fixed navbar + padding
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - navbarHeight,
        behavior: "smooth", // smooth animated scroll
      });
    }
  };

  // ── AUTO-HIGHLIGHT ACTIVE CATEGORY ON SCROLL ─
  // Uses IntersectionObserver to watch each category
  // section. When a section enters the viewport,
  // its pill becomes active automatically.
  // This makes scrolling and clicking feel connected.
  useEffect(() => {
    if (!menuItems.length) return;

    const grouped = groupByCategory(menuItems);
    const cats = Object.keys(grouped);
    const observers = [];

    cats.forEach((cat) => {
      const el = document.getElementById(`category-${cat}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          // When section enters viewport update the active pill
          if (entry.isIntersecting) {
            setActiveCategory(cat);
          }
        },
        {
          // Triggers when element crosses the top 20% of viewport
          rootMargin: "-80px 0px -60% 0px",
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    // Cleanup all observers when component unmounts
    return () => observers.forEach((obs) => obs.disconnect());
  }, [menuItems]);
  // Called by AddReviewForm after successful submit
  // Adds the new review to the top of the list
  // without making another network request
  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  // Format price
  const formatPrice = (price) => `₦${price?.toLocaleString() || 0}`;

  // ── LOADING STATE ───────────────────────────
  if (loading) return <SkeletonDetail />;

  // ── ERROR STATE ─────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">{error}</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  // Group menu items by their category field
  const groupedMenu = groupByCategory(menuItems);
  const categories = Object.keys(groupedMenu);

  // Check if cart belongs to this restaurant
  const isCartFromThisRestaurant = cartRestaurantId === id;
  const cartItemsToShow = isCartFromThisRestaurant ? cartItems : [];
  const cartTotal = isCartFromThisRestaurant ? getCartTotal() : 0;

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ══════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════ */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gray-900">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-70"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop";
          }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1 px-3 py-2
                     bg-black/40 backdrop-blur-sm text-white text-sm font-medium
                     rounded-xl hover:bg-black/60 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Restaurant name overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {restaurant.name}
          </h1>
          <p className="text-gray-300 mt-1 text-sm line-clamp-2">
            {restaurant.description}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          INFO STRIP
      ══════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {/* Cuisine */}
            <span className="bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full text-xs">
              {restaurant.cuisine}
            </span>

            {/* Rating */}
            <StarRating rating={restaurant.rating} />

            {/* Delivery time */}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-400" />
              {restaurant.delivery_time}
            </span>

            {/* Delivery fee */}
            <span className="flex items-center gap-1">
              <Bike className="w-4 h-4 text-orange-400" />
              {formatPrice(restaurant.delivery_fee)} delivery
            </span>

            {/* Address */}
            <span className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-4 h-4" />
              {restaurant.address}
            </span>

            {/* Hours */}
            <span className="text-gray-400 text-xs">
              {restaurant.opening_time} – {restaurant.closing_time}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT — Two Column Layout
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 items-start">
        {/* ── LEFT COLUMN ── Menu + Reviews */}
        <div className="flex-1 min-w-0 space-y-10">
          {/* ── MENU SECTION ── */}
          <section>
            <h2
              className="text-2xl font-bold text-gray-900 mb-5"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Menu 🍽️
            </h2>

            {/* Category tab pills */}
            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
                               transition-all duration-200 whitespace-nowrap ${
                                 activeCategory === cat
                                   ? "bg-orange-500 text-white"
                                   : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
                               }`}
                  >
                    {cat} ({groupedMenu[cat].length})
                  </button>
                ))}
              </div>
            )}

            {/* Menu items — show all categories or just active */}
            <div className="space-y-8">
              {categories.map((cat) => (
                // Show all categories — the pill just scrolls to them
                <div key={cat} id={`category-${cat}`}>
                  <h3
                    className="text-base font-bold text-gray-700 mb-3
                                  flex items-center gap-2"
                  >
                    <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
                    {cat}
                  </h3>
                  <div className="space-y-3">
                    {groupedMenu[cat].map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        restaurantId={id}
                        restaurantName={restaurant.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REVIEWS SECTION ── */}
          <section>
            <h2
              className="text-2xl font-bold text-gray-900 mb-5"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Reviews ⭐ ({reviews.length})
            </h2>

            {/* Add review form */}
            <div className="mb-6">
              <AddReviewForm
                restaurantId={id}
                onReviewAdded={handleReviewAdded}
              />
            </div>

            {/* Review list */}
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-gray-500 text-sm">
                  No reviews yet. Be the first!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── RIGHT COLUMN ── Sticky Cart Panel */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div
            className="sticky top-24 bg-white rounded-2xl border border-gray-100
                          shadow-lg overflow-hidden"
          >
            {/* Cart header */}
            <div className="bg-gray-900 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold">Your Order</span>
              </div>
              {cartItemsToShow.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-5">
              {cartItemsToShow.length === 0 ? (
                // Empty cart state
                <div className="text-center py-8">
                  <ShoppingCart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-medium">
                    Your cart is empty
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    Add items from the menu to get started
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart items list */}
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cartItemsToShow.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {/* Item name + price */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-orange-500 font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center
                                       justify-center hover:bg-orange-100 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="text-sm font-bold text-gray-800 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-6 h-6 rounded-full bg-orange-500 flex items-center
                                       justify-center hover:bg-orange-600 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order summary */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Delivery fee</span>
                      <span>{formatPrice(restaurant.delivery_fee)}</span>
                    </div>
                    <div
                      className="flex justify-between font-bold text-gray-900 pt-1
                                    border-t border-gray-100"
                    >
                      <span>Total</span>
                      <span className="text-orange-500">
                        {formatPrice(cartTotal + restaurant.delivery_fee)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout button */}
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-600
                               text-white font-bold rounded-xl transition-all duration-200
                               shadow-lg shadow-orange-200"
                  >
                    Proceed to Checkout →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
