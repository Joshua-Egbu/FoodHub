// ============================================
// src/pages/user/Checkout.jsx
// ============================================
// Two-column checkout page.
// Left: delivery address form
// Right: sticky order summary
//
// Payment flow:
//   1. User fills in delivery details
//   2. Clicks "Pay with Paystack"
//   3. Paystack popup opens (test mode)
//   4. User completes payment
//   5. On success callback → save order to Supabase
//   6. Clear cart → navigate to /order-success
//
// Paystack is loaded via their CDN script tag
// in public/index.html — no npm package needed.
// ============================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  User,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Loader,
} from "lucide-react";
import useCart from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../api/orderApi";
import { getRestaurantDeliveryInfo } from "../../api/restaurantApi";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const {
    cartItems,
    cartRestaurantId,
    cartRestaurantName,
    getCartTotal,
    clearCart,
  } = useCart();

  // ── STATE ───────────────────────────────────
  const [restaurant, setRestaurant] = useState(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Delivery form fields
  const [form, setForm] = useState({
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    address: "",
    city: "Lagos",
    note: "",
  });

  // ── REDIRECT IF CART IS EMPTY ────────────────
  // If user somehow lands here with empty cart
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // ── FETCH RESTAURANT FOR DELIVERY FEE ───────

  useEffect(() => {
    if (!cartRestaurantId) {
      setLoadingRestaurant(false);
      return;
    }
    const fetchDeliveryInfo = async () => {
      setLoadingRestaurant(true);
      try {
        const data = await getRestaurantDeliveryInfo(cartRestaurantId);
        setRestaurant(data);
      } catch (err) {
        console.error("Could not load restaurant:", err);
      } finally {
        setLoadingRestaurant(false);
      }
    };
    fetchDeliveryInfo();
  }, [cartRestaurantId]);

  // ── FORM HANDLER ─────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── PRICE HELPERS ────────────────────────────
  const formatPrice = (amount) => `₦${Number(amount).toLocaleString()}`;
  const subtotal = getCartTotal();
  const deliveryFee = restaurant?.delivery_fee || 0;
  const grandTotal = subtotal + deliveryFee;

  // ── VALIDATE FORM ────────────────────────────
  const validateForm = () => {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!form.address.trim()) return "Please enter your delivery address.";
    return null;
  };

  // ── SAVE ORDER TO SUPABASE ───────────────────
  // Called ONLY after Paystack confirms payment
  const saveOrder = async (paymentReference) => {
    const orderData = {
      user_id: user.id,
      restaurant_id: cartRestaurantId,
      items: cartItems, // stored as JSONB in Supabase
      total_amount: grandTotal,
      delivery_address: `${form.address}, ${form.city}`,
      delivery_fee: deliveryFee,
      payment_ref: paymentReference,
      status: "confirmed",
    };

    const order = await createOrder(orderData);

    return order;
  };

  // ── HANDLE PAYSTACK PAYMENT ──────────────────
  // This triggers the Paystack popup.
  // Paystack is loaded from CDN in public/index.html
  // so window.PaystackPop is available globally.
  const handlePayment = () => {
    // Debug: log key state so we can see what's going on
    console.log("[Checkout] handlePayment called");
    console.log("[Checkout] loadingRestaurant:", loadingRestaurant);
    console.log("[Checkout] PaystackPop available:", !!window.PaystackPop);
    console.log(
      "[Checkout] VITE_PAYSTACK_PUBLIC_KEY:",
      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    );
    console.log("[Checkout] user email:", user?.email);
    console.log("[Checkout] grandTotal:", grandTotal);

    if (loadingRestaurant) {
      setError("Still loading restaurant info. Please wait a moment.");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsProcessing(true);

    // Check Paystack is loaded from CDN
    if (!window.PaystackPop) {
      setError("Payment system not loaded. Please refresh and try again.");
      setIsProcessing(false);
      return;
    }

    // Check key exists
    if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
      setError("Paystack public key is missing. Check your .env file.");
      setIsProcessing(false);
      return;
    }

    // Amount must be in KOBO (Naira × 100) for Paystack
    const amountInKobo = grandTotal * 100;

    try {
      const handler = window.PaystackPop.setup({
        // Your Paystack test public key from .env
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user?.email || "guest@example.com",
        amount: amountInKobo,
        currency: "NGN",
        ref: `FOODHUB-${Date.now()}`, // unique reference for this transaction
        metadata: {
          custom_fields: [
            {
              display_name: "Customer",
              variable_name: "customer",
              value: form.fullName,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: form.phone,
            },
            {
              display_name: "Restaurant",
              variable_name: "restaurant",
              value: cartRestaurantName,
            },
          ],
        },

        // ── PAYMENT SUCCESS ────────────────────
        // Paystack calls this when payment is confirmed
        callback: function (response) {
          (async () => {
            try {
              // Save order to Supabase with the payment reference
              const order = await saveOrder(response.reference);

              // Clear the cart
              clearCart();

              // Navigate to success page with order details
              window.location.href = `/order-success?ref=${response.reference}`;
            } catch (err) {
              setError(
                "Payment succeeded but order could not be saved. Please contact support.",
              );
              console.error("Order save error:", err);
            } finally {
              setIsProcessing(false);
            }
          })();
        },

        // ── PAYMENT CLOSED ─────────────────────
        // User closed the Paystack popup without paying
        onClose: () => {
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack Initialization Error:", err);
      setError(`Failed to initialize payment: ${err.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ── PAGE HEADER ── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 rounded-xl bg-white border border-gray-200
                       hover:border-orange-300 text-gray-600 hover:text-orange-500 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Checkout
            </h1>
            <p className="text-gray-500 text-sm">
              Complete your order from {cartRestaurantName}
            </p>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ══════════════════════════════
              LEFT — DELIVERY FORM
          ══════════════════════════════ */}
          <div className="flex-1 space-y-5">
            {/* Error banner */}
            {error && (
              <div
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200
                              rounded-2xl text-red-600"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Delivery details card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Delivery Details
              </h2>

              <div className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-orange-400
                                 text-gray-800 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-orange-400
                                 text-gray-800 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                {/* Delivery address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House number, street name, area..."
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-orange-400
                                 text-gray-800 placeholder-gray-400 text-sm resize-none"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-orange-400
                               text-gray-800 text-sm bg-white"
                  >
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Port Harcourt</option>
                    <option>Ibadan</option>
                    <option>Kano</option>
                  </select>
                </div>

                {/* Order note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Note{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Any special instructions for your order..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-orange-400
                               text-gray-800 placeholder-gray-400 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-gray-400 text-xs px-1">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Your payment is secured by Paystack. We never store your card
              details.
            </div>
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

              {/* Items list */}
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
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

              <div className="border-t border-gray-100 my-4" />

              {/* Price breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery fee</span>
                  <span className="text-gray-700 font-medium">
                    {loadingRestaurant ? "..." : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-orange-500">
                  {loadingRestaurant ? "..." : formatPrice(grandTotal)}
                </span>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || loadingRestaurant}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300
                           text-white font-bold rounded-xl transition-all duration-200
                           flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : loadingRestaurant ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Calculating total...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Pay {formatPrice(grandTotal)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
