// ============================================
// src/pages/user/OrderSuccess.jsx
// ============================================
// Shown after a successful Paystack payment.
// Receives order details via React Router's
// location.state (passed from Checkout.jsx).
//
// If user navigates here directly without
// state (e.g. types URL manually), we show
// a generic success message and redirect.
// ============================================

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Clock, MapPin } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State passed from Checkout.jsx after payment
  const { order, restaurantName, deliveryAddress } = location.state || {};

  // ── REDIRECT IF NO STATE ─────────────────────
  // If someone navigates here directly with no order data
  useEffect(() => {
    if (!order) {
      // Wait 2 seconds then redirect to home
      const timer = setTimeout(() => navigate("/home"), 2000);
      return () => clearTimeout(timer);
    }
  }, [order, navigate]);

  // ── FORMAT DATE ──────────────────────────────
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── FORMAT PRICE ─────────────────────────────
  const formatPrice = (amount) => `₦${Number(amount).toLocaleString()}`;

  // ── NO ORDER STATE ───────────────────────────
  if (!order) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Order Placed!</h2>
          <p className="text-gray-500 text-sm mt-2">
            Redirecting you to home...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        {/* ── SUCCESS ANIMATION ── */}
        <div className="text-center mb-8">
          {/* Green circle with checkmark */}
          <div
            className="w-24 h-24 bg-green-100 rounded-full flex items-center
                          justify-center mx-auto mb-5 animate-bounce"
          >
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>

          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-500">
            Your food is being prepared and will be on its way soon.
          </p>
        </div>

        {/* ── ORDER DETAILS CARD ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
          {/* Orange header strip */}
          <div className="bg-orange-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs font-medium">
                  Order Reference
                </p>
                <p className="text-white font-bold text-sm font-mono">
                  {order.payment_reference}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-orange-200" />
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Restaurant */}
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 bg-orange-100 rounded-lg flex items-center
                              justify-center flex-shrink-0 mt-0.5"
              >
                <ShoppingBag className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Restaurant</p>
                <p className="text-gray-800 font-semibold">{restaurantName}</p>
              </div>
            </div>

            {/* Delivery address */}
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 bg-blue-100 rounded-lg flex items-center
                              justify-center flex-shrink-0 mt-0.5"
              >
                <MapPin className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Delivering to
                </p>
                <p className="text-gray-800 font-semibold">{deliveryAddress}</p>
              </div>
            </div>

            {/* Estimated delivery */}
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 bg-purple-100 rounded-lg flex items-center
                              justify-center flex-shrink-0 mt-0.5"
              >
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Order placed
                </p>
                <p className="text-gray-800 font-semibold">
                  {order.created_at ? formatDate(order.created_at) : "Just now"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              {/* Items ordered */}
              <p className="text-xs text-gray-400 font-medium mb-2">
                Items Ordered
              </p>
              <div className="space-y-1">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-700 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
                <span className="font-bold text-gray-800">Total Paid</span>
                <span className="font-bold text-orange-500 text-lg">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATUS BADGE ── */}
        <div
          className="bg-green-50 border border-green-200 rounded-2xl p-4 flex
                        items-center gap-3 mb-6"
        >
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
          <p className="text-green-700 text-sm font-medium">
            Your order is confirmed and being prepared 🍳
          </p>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/home")}
            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white
                       font-semibold rounded-xl transition-colors flex items-center
                       justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 py-3 bg-white border border-gray-200 hover:border-orange-300
                       text-gray-700 hover:text-orange-500 font-semibold rounded-xl
                       transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
