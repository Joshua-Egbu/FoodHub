// ============================================
// src/components/restaurant/MenuItemCard.jsx
// ============================================
// Displays a single menu item.
// Has two visual states:
//   1. Not in cart → shows "Add" button
//   2. In cart → shows quantity controls (- count +)
//
// Props:
//   item           → the menu item object from Supabase
//   restaurantId   → id of the parent restaurant
//   restaurantName → name of the parent restaurant
// Both restaurant props are needed for the
// one-restaurant rule inside CartContext
// ============================================

import React from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import useCart from "../../hooks/useCart";

const MenuItemCard = ({ item, restaurantId, restaurantName }) => {
  const { addToCart, increaseQuantity, decreaseQuantity, getCartItem } =
    useCart();

  // Check if this specific item is already in the cart
  // Returns the cart item object (with quantity) or undefined
  const cartItem = getCartItem(item.id);
  const isInCart = !!cartItem;

  // Format price with Naira symbol and commas
  const formatPrice = (price) => `₦${price?.toLocaleString() || 0}`;

  return (
    <div
      className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100
                    hover:border-orange-200 hover:shadow-md transition-all duration-200"
    >
      {/* ── ITEM IMAGE ── */}
      <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop";
          }}
        />
      </div>

      {/* ── ITEM INFO ── */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">
          {item.name}
        </h4>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">
          {item.description}
        </p>

        {/* Price + Cart controls row */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <span className="font-bold text-orange-500 text-sm">
            {formatPrice(item.price)}
          </span>

          {/* ── CART CONTROLS ── */}
          {!item.is_available ? (
            // Item unavailable
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              Unavailable
            </span>
          ) : isInCart ? (
            // Item IS in cart — show quantity controls
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="w-7 h-7 rounded-full bg-orange-100 text-orange-500
                           flex items-center justify-center hover:bg-orange-500
                           hover:text-white transition-all duration-200"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              {/* Current quantity */}
              <span className="font-bold text-gray-800 text-sm w-4 text-center">
                {cartItem.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(item.id)}
                className="w-7 h-7 rounded-full bg-orange-500 text-white
                           flex items-center justify-center hover:bg-orange-600
                           transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            // Item NOT in cart — show Add button
            <button
              onClick={() => addToCart(item, restaurantId, restaurantName)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500
                         hover:bg-orange-600 text-white text-xs font-bold
                         rounded-full transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
