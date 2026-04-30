// ============================================
// src/context/CartContext.jsx
// ============================================
// Manages everything related to the cart.
// Wraps the whole app so any component can
// access cart state and functions via useCart()
//
// Key behaviours:
//  1. Cart persists in localStorage (survives refresh)
//  2. Cart can only hold items from ONE restaurant
//     at a time — just like Chowdeck/Jumia Food
//  3. Adding from a different restaurant prompts
//     the user to clear cart and start fresh
// ============================================

import React, { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  // We initialise state directly from localStorage
  // so the cart is restored immediately on page load
  // without any flickering or empty cart flash

  const [cartItems, setCartItems] = useState(() => {
    // This function runs ONCE on first render
    // It tries to read saved cart from localStorage
    try {
      const saved = localStorage.getItem("foodhub_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartRestaurantId, setCartRestaurantId] = useState(() => {
    try {
      return localStorage.getItem("foodhub_cart_restaurant_id") || null;
    } catch {
      return null;
    }
  });

  const [cartRestaurantName, setCartRestaurantName] = useState(() => {
    try {
      return localStorage.getItem("foodhub_cart_restaurant_name") || "";
    } catch {
      return "";
    }
  });

  // ── PERSIST TO LOCALSTORAGE ─────────────────
  // Every time cartItems changes, save to localStorage
  // useEffect watches cartItems — runs after every change
  useEffect(() => {
    localStorage.setItem("foodhub_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (cartRestaurantId) {
      localStorage.setItem("foodhub_cart_restaurant_id", cartRestaurantId);
    } else {
      localStorage.removeItem("foodhub_cart_restaurant_id");
    }
  }, [cartRestaurantId]);

  useEffect(() => {
    if (cartRestaurantName) {
      localStorage.setItem("foodhub_cart_restaurant_name", cartRestaurantName);
    } else {
      localStorage.removeItem("foodhub_cart_restaurant_name");
    }
  }, [cartRestaurantName]);

  // ── CLEAR CART HELPER ───────────────────────
  // Resets everything — items, restaurant id, name
  const clearCart = () => {
    setCartItems([]);
    setCartRestaurantId(null);
    setCartRestaurantName("");
    // Also clear localStorage manually to be safe
    localStorage.removeItem("foodhub_cart");
    localStorage.removeItem("foodhub_cart_restaurant_id");
    localStorage.removeItem("foodhub_cart_restaurant_name");
  };

  // ── ADD TO CART ─────────────────────────────
  // This is the most important function.
  // Called when user clicks "Add to Cart" on a menu item.
  //
  // Parameters:
  //   item           → the menu item object { id, name, price, image_url, ... }
  //   restaurantId   → id of the restaurant this item belongs to
  //   restaurantName → name of the restaurant (for the warning message)
  const addToCart = (item, restaurantId, restaurantName) => {
    // ── ONE RESTAURANT RULE ─────────────────
    // If cart already has items from a DIFFERENT restaurant,
    // warn the user and ask if they want to start fresh
    if (
      cartRestaurantId &&
      cartRestaurantId !== restaurantId &&
      cartItems.length > 0
    ) {
      // Use a custom toast with action buttons
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-800">
              Your cart has items from{" "}
              <span className="font-bold text-orange-500">
                {cartRestaurantName}
              </span>
              . Clear cart and add from{" "}
              <span className="font-bold text-orange-500">
                {restaurantName}
              </span>
              ?
            </p>
            <div className="flex gap-2">
              {/* If user confirms — clear old cart then add new item */}
              <button
                onClick={() => {
                  toast.dismiss(t.id); // close this toast
                  clearCart();
                  // After clearing, add the new item
                  setCartRestaurantId(restaurantId);
                  setCartRestaurantName(restaurantName);
                  setCartItems([{ ...item, quantity: 1 }]);
                  toast.success(`${item.name} added to cart!`);
                }}
                className="flex-1 py-1.5 bg-orange-500 text-white text-xs font-bold
                           rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear & Add
              </button>
              {/* If user cancels — dismiss toast, do nothing */}
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold
                           rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          duration: 8000, // give user 8 seconds to decide
          style: {
            background: "#fff",
            border: "1px solid #fed7aa",
            borderRadius: "12px",
            padding: "16px",
            maxWidth: "320px",
          },
        },
      );
      return; // stop here — don't add item yet
    }

    // ── NORMAL ADD ──────────────────────────
    // Cart is either empty or from the same restaurant
    // Set restaurant info if cart was empty
    if (!cartRestaurantId) {
      setCartRestaurantId(restaurantId);
      setCartRestaurantName(restaurantName);
    }

    // Check if item already exists in cart
    const existingItem = cartItems.find((ci) => ci.id === item.id);

    if (existingItem) {
      // Item already in cart — just increase its quantity
      setCartItems(
        cartItems.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci,
        ),
      );
      toast.success(`${item.name} quantity updated!`);
    } else {
      // New item — add to cart with quantity of 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      toast.success(`${item.name} added to cart!`);
    }
  };

  // ── REMOVE FROM CART ────────────────────────
  // Completely removes an item regardless of quantity
  const removeFromCart = (itemId) => {
    const updated = cartItems.filter((ci) => ci.id !== itemId);
    setCartItems(updated);

    // If cart is now empty, also clear the restaurant info
    if (updated.length === 0) {
      setCartRestaurantId(null);
      setCartRestaurantName("");
    }

    toast.success("Item removed from cart");
  };

  // ── INCREASE QUANTITY ───────────────────────
  // Adds 1 to a specific item's quantity
  const increaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((ci) =>
        ci.id === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci,
      ),
    );
  };

  // ── DECREASE QUANTITY ───────────────────────
  // Removes 1 from quantity.
  // If quantity reaches 0, removes the item entirely.
  const decreaseQuantity = (itemId) => {
    const item = cartItems.find((ci) => ci.id === itemId);
    if (!item) return;

    if (item.quantity === 1) {
      // Quantity would become 0 — remove item instead
      removeFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map((ci) =>
          ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci,
        ),
      );
    }
  };

  // ── GET CART TOTAL ──────────────────────────
  // Adds up price × quantity for every item
  // Returns a number e.g. 4500
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0); // 0 is the starting total
  };

  // ── GET CART COUNT ──────────────────────────
  // Total number of individual items in cart
  // e.g. 2x Jollof Rice + 1x Chicken = 3
  // This is what shows on the navbar badge
  const getCartCount = () => {
    return cartItems.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  };

  // ── CHECK IF ITEM IS IN CART ─────────────────
  // Returns the cart item (with quantity) or undefined
  // Used by menu item cards to show current quantity
  const getCartItem = (itemId) => {
    return cartItems.find((ci) => ci.id === itemId);
  };

  // ── CONTEXT VALUE ───────────────────────────
  // Everything we expose to the rest of the app
  const value = {
    cartItems,
    cartRestaurantId,
    cartRestaurantName,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ── EXPORT CONTEXT ──────────────────────────
// Other files import this to use useContext directly
// but most will use the useCart hook below instead
export default CartContext;
