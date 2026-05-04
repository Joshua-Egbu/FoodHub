// ============================================
// src/components/restaurant/RestaurantCard.jsx
// ============================================
// A reusable card that displays one restaurant.
// Used everywhere restaurants are listed:
//   - Home page (top rated + all restaurants)
//   - Restaurant List page
//   - Search results
//
// Props:
//   restaurant → the full restaurant object from Supabase
//   horizontal → if true, renders a wider horizontal card
//                (used in Top Rated row on Home page)
// ============================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Bike, MapPin } from "lucide-react";

// ── STAR RATING DISPLAY ─────────────────────
// Renders filled and empty stars based on rating number
// e.g. rating 4.3 → 4 filled stars + 1 empty
const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? "text-amber-400 fill-amber-400" // filled star
              : "text-gray-300 fill-gray-300" // empty star
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating?.toFixed(1)}</span>
    </div>
  );
};

// ── OPEN/CLOSED BADGE ───────────────────────
// Checks current time against restaurant hours
// Returns green "Open" or red "Closed" badge
const OpenClosedBadge = ({ openingTime, closingTime }) => {
  // Parse time strings like "8:00 AM" into comparable numbers
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes; // convert to total minutes for easy comparison
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTime(openingTime);
  const closeMinutes = parseTime(closingTime);

  // Handle restaurants that close past midnight
  let isOpen = false;
  if (openMinutes !== null && closeMinutes !== null) {
    if (closeMinutes < openMinutes) {
      // Closes after midnight e.g. open 4PM close 2AM
      isOpen = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    } else {
      isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    }
  }

  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      {isOpen ? "● Open" : "● Closed"}
    </span>
  );
};

// ── MAIN RESTAURANT CARD ────────────────────
const RestaurantCard = ({ restaurant, horizontal = false }) => {
  const navigate = useNavigate();

  // Format price — adds ₦ and commas
  // e.g. 500 → ₦500 | 1500 → ₦1,500
  const formatPrice = (price) => {
    return `₦${price?.toLocaleString() || 0}`;
  };

  const handleClick = () => {
    navigate(`/restaurants/${restaurant.id}`);
  };

  // ── HORIZONTAL CARD (for Top Rated row) ──
  if (horizontal) {
    return (
      <div
        onClick={handleClick}
        className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm
                   border border-gray-100 cursor-pointer hover:shadow-md hover:scale-[1.02]
                   transition-all duration-200 group"
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-gray-100">
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // If image fails to load, show a grey placeholder
              e.target.src =
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop";
            }}
          />
          {/* Cuisine badge on image */}
          <span
            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700
                           text-xs font-semibold px-2 py-1 rounded-full"
          >
            {restaurant.cuisine}
          </span>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <h3 className="font-bold text-gray-900 text-sm truncate">
            {restaurant.name}
          </h3>

          <StarRating rating={restaurant.rating || 0} />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {restaurant.delivery_time}
            </span>
            <span className="flex items-center gap-1">
              <Bike className="w-3 h-3" />
              {formatPrice(restaurant.delivery_fee)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── VERTICAL CARD (default — for grid layouts) ──
  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100
                 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
    >
      {/* Image section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop";
          }}
        />

        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Cuisine badge — top left */}
        <span
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700
                         text-xs font-semibold px-2.5 py-1 rounded-full"
        >
          {restaurant.cuisine}
        </span>

        {/* Open/closed badge — top right */}
        <div className="absolute top-3 right-3">
          <OpenClosedBadge
            openingTime={restaurant.opening_time}
            closingTime={restaurant.closing_time}
          />
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 space-y-2">
        {/* Restaurant name */}
        <h3
          className="font-bold text-gray-900 text-base leading-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {restaurant.name}
        </h3>

        {/* Address */}
        <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {restaurant.address}
        </p>

        {/* Star rating */}
        <StarRating rating={restaurant.rating || 0} />

        {/* Divider */}
        <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
          {/* Delivery time */}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            {restaurant.delivery_time}
          </span>

          {/* Delivery fee */}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Bike className="w-3.5 h-3.5 text-orange-400" />
            {formatPrice(restaurant.delivery_fee)} delivery
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
