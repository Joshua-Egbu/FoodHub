// ============================================
// src/pages/user/OrderSuccess.jsx
// ============================================

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Clock, MapPin } from "lucide-react";

import { createClient } from "@supabase/supabase-js";

// Supabase client (safe for frontend use)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // URL reference (PRIMARY SOURCE)
  const ref = params.get("ref");

  // fallback from navigation state
  const {
    order: stateOrder,
    restaurantName,
    deliveryAddress,
  } = location.state || {};

  const [order, setOrder] = useState(stateOrder || null);
  const [loading, setLoading] = useState(!stateOrder && !!ref);

  // ============================================
  // FETCH ORDER FROM SUPABASE IF NEEDED
  // ============================================
  useEffect(() => {
    const fetchOrder = async () => {
      if (!ref || order) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("payment_ref", ref)
        .single();

      if (error) {
        console.error("Order fetch error:", error);
      }

      if (data) {
        setOrder(data);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [ref, order]);

  // ============================================
  // AUTO REDIRECT IF INVALID ACCESS
  // ============================================
  useEffect(() => {
    if (!loading && !order && !ref) {
      const timer = setTimeout(() => navigate("/home"), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, order, ref, navigate]);

  // ============================================
  // HELPERS
  // ============================================
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

  const formatPrice = (amount) => `₦${Number(amount).toLocaleString()}`;

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading your order...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // NO ORDER STATE
  // ============================================
  if (!order) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Order Completed</h2>
          <p className="text-gray-500 text-sm mt-2">
            Redirecting you to home...
          </p>
        </div>
      </div>
    );
  }

  // fallback (for old navigation.state usage)
  const finalRestaurantName = restaurantName || order.restaurant_name;
  const finalAddress = deliveryAddress || order.delivery_address;

  // ============================================
  // MAIN UI
  // ============================================
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        {/* SUCCESS HEADER */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed! 🎉
          </h1>

          <p className="text-gray-500">Your food is being prepared</p>
        </div>

        {/* ORDER CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
          {/* HEADER */}
          <div className="bg-orange-500 px-6 py-4">
            <p className="text-orange-100 text-xs">Order Reference</p>
            <p className="text-white font-bold text-sm font-mono">
              {order.payment_ref}
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* RESTAURANT */}
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-400">Restaurant</p>
                <p className="font-semibold text-gray-800">
                  {finalRestaurantName}
                </p>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-400">Delivery</p>
                <p className="font-semibold text-gray-800">{finalAddress}</p>
              </div>
            </div>

            {/* TIME */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-gray-400">Ordered At</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="border-t pt-4">
              <p className="text-xs text-gray-400 mb-2">Items</p>

              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="border-t mt-3 pt-3 flex justify-between">
                <span className="font-bold">Total Paid</span>
                <span className="font-bold text-orange-500">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <p className="text-green-700 text-sm">
            Your order is confirmed and being prepared
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/home")}
            className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold"
          >
            <Home className="w-4 h-4 inline mr-2" />
            Home
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex-1 py-3 bg-white border rounded-xl font-semibold"
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
