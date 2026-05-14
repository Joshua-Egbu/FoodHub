// ============================================
// src/pages/user/Cart.jsx
// ============================================
// Full dedicated cart page.
// Shows all items in the cart with quantity
// controls, pricing, and a sticky order summary
// panel that leads to checkout.
//
// All cart state comes from CartContext via
// the useCart() hook — no local state for items.
// ============================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  UtensilsCrossed,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import useCart from "../../hooks/useCart";
import { getRestaurantById } from "../../api/restaurantApi";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartRestaurantId,
    cartRestaurantName,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  // ── STATE ───────────────────────────────────
  // We fetch the restaurant to get its delivery fee
  const [restaurant, setRestaurant] = useState(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(false);

  // ── FETCH RESTAURANT FOR DELIVERY FEE ───────
  // We need the delivery fee from the restaurant
  // table — it's not stored in the cart items
  useEffect(() => {
    if (!cartRestaurantId) return;

    const fetchRestaurant = async () => {
      setLoadingRestaurant(true);
      try {
        const data = await getRestaurantById(cartRestaurantId);
        setRestaurant(data);
      } catch (err) {
        console.error("Could not load restaurant info:", err);
      } finally {
        setLoadingRestaurant(false);
      }
    };

    fetchRestaurant();
  }, [cartRestaurantId]);

  // ── PRICE HELPERS ────────────────────────────
  const formatPrice = (amount) => `₦${Number(amount).toLocaleString()}`;
  const subtotal = getCartTotal();
  const deliveryFee = restaurant?.delivery_fee || 0;
  const grandTotal = subtotal + deliveryFee;

  // ── HANDLE CHECKOUT ──────────────────────────
  const handleCheckout = () => {
    navigate("/checkout");
  };

  // ── HANDLE CLEAR CART WITH TOAST CONFIRMATION ─
  const handleClearCart = () => {
    toast(
      (t) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ margin: 0, fontWeight: 600, color: "#1f2937" }}>
            Clear your entire cart?
          </p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
            This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                color: "#374151",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                clearCart();
                toast.dismiss(t.id);
                toast.success("Cart cleared!", { duration: 2000 });
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#ef4444",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Yes, Clear
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          borderRadius: "14px",
          padding: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          maxWidth: "320px",
        },
      }
    );
  };

  // ── EMPTY CART STATE ─────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          {/* Empty cart illustration */}
          <div
            className="w-24 h-24 bg-orange-100 rounded-full flex items-center
                          justify-center mx-auto mb-6"
          >
            <ShoppingCart className="w-12 h-12 text-orange-300" />
          </div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            You haven't added any items yet. Browse restaurants and add
            something delicious to your cart.
          </p>
          <button
            onClick={() => navigate("/restaurants")}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white
                       font-semibold rounded-xl transition-colors shadow-lg
                       shadow-orange-200 flex items-center gap-2 mx-auto"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Toaster />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ── PAGE HEADER ── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-200
                       hover:border-orange-300 text-gray-600 hover:text-orange-500
                       transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Your Cart
            </h1>
            <p className="text-gray-500 text-sm">
              {getCartCount()} item{getCartCount() !== 1 ? "s" : ""} from{" "}
              <span className="text-orange-500 font-medium">
                {cartRestaurantName}
              </span>
            </p>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ══════════════════════════════
              LEFT — CART ITEMS LIST
          ══════════════════════════════ */}
          <div className="flex-1 space-y-4">
            {/* Individual cart items */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100
                           flex gap-4 items-start"
              >
                {/* Item image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
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

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {item.description}
                  </p>
                  <p className="text-orange-500 font-bold text-sm mt-1">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity controls + remove */}
                  <div className="flex items-center justify-between mt-3">
                    {/* − / quantity / + */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200
                                   flex items-center justify-center text-orange-500
                                   hover:bg-orange-500 hover:text-white transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-8 text-center font-bold text-gray-800 text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200
                                   flex items-center justify-center text-orange-500
                                   hover:bg-orange-500 hover:text-white transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item subtotal + remove */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500
                                   hover:bg-red-50 rounded-lg transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear entire cart button */}
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600
                         transition-colors py-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear entire cart
            </button>
          </div>

          {/* ══════════════════════════════
              RIGHT — ORDER SUMMARY (sticky)
          ══════════════════════════════ */}
          <div className="lg:w-80 xl:w-96">
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100
                            p-5 lg:sticky lg:top-28"
            >
              <h2
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Order Summary
              </h2>

              {/* Restaurant name */}
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl mb-4">
                <UtensilsCrossed className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <p className="text-sm text-gray-700 font-medium truncate">
                  {cartRestaurantName}
                </p>
              </div>

              {/* Items breakdown */}
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate flex-1 mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-700 font-medium flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Price breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700 font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery fee</span>
                  <span className="text-gray-700 font-medium">
                    {loadingRestaurant ? "..." : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Grand total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-orange-500">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              {/* Delivery time estimate */}
              {restaurant && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl mb-4">
                  <span className="text-green-600 text-sm">
                    🕐 Estimated delivery:{" "}
                    <strong>{restaurant.delivery_time}</strong>
                  </span>
                </div>
              )}

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white
                           font-bold rounded-xl transition-all duration-200 flex items-center
                           justify-center gap-2 shadow-lg shadow-orange-200"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Continue shopping */}
              <button
                onClick={() => navigate("/restaurants")}
                className="w-full py-3 mt-3 text-sm text-gray-500 hover:text-orange-500
                           transition-colors font-medium"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
