// ============================================
// src/pages/user/Profile.jsx
// ============================================
// User profile page with two sections:
//   Left  — Edit personal info + avatar
//   Right — Order history
//
// Data sources:
//   - Profile info from AuthContext (already loaded)
//   - Order history fetched from Supabase via orderApi
// ============================================

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  ShoppingBag,
  Clock,
  CheckCircle,
  Loader,
  AlertCircle,
  Package,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/userApi";
import { getUserOrders } from "../../api/orderApi";
import toast from "react-hot-toast";

// ── ORDER STATUS BADGE ──────────────────────
// Shows a coloured badge based on order status
const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
  };
  const icons = {
    confirmed: <Clock className="w-3 h-3" />,
    delivered: <CheckCircle className="w-3 h-3" />,
    pending: <Package className="w-3 h-3" />,
  };
  return (
    <span
      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1
                      rounded-full capitalize ${styles[status] || styles.pending}`}
    >
      {icons[status] || icons.pending}
      {status}
    </span>
  );
};

// ── ORDER SKELETON ──────────────────────────
const OrderSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-4 border border-gray-100">
    <div className="flex gap-3">
      <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { user, profile, setProfile } = useAuth();

  // ── STATE ───────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Form fields pre-filled from AuthContext profile
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    avatar_url: profile?.avatar_url || "",
  });

  // Preview of newly selected avatar before saving
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const fileInputRef = useRef(null);

  // ── FETCH ORDER HISTORY ─────────────────────
  useEffect(() => {
    if (!user?.id) return;
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(user.id);
        setOrders(data);
      } catch (err) {
        setOrdersError("Could not load your orders.");
        console.log(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user?.id]);

  // ── HANDLE FORM CHANGE ──────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── HANDLE AVATAR UPLOAD ────────────────────
  // Converts selected image to base64 string
  // Stored directly in the profiles table as a URL
  // For a school project this is perfectly fine
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size — max 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setAvatarPreview(base64); // show preview immediately
      setForm({ ...form, avatar_url: base64 }); // save to form
    };
    reader.readAsDataURL(file);
  };

  // ── HANDLE SAVE ─────────────────────────────
  const handleSave = async () => {
    if (!form.full_name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateProfile(user.id, {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        avatar_url: form.avatar_url,
      });
      // Update AuthContext so navbar avatar updates immediately
      // We reach into AuthContext's profile setter if exposed
      // If not, the change is saved in DB and shows on next login
      setProfile(updated);

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
      console.log(err);
    } finally {
      setSavingProfile(false);
    }
  };

  // ── FORMAT HELPERS ───────────────────────────
  const formatPrice = (amount) => `₦${Number(amount).toLocaleString()}`;
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            My Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account details and view your order history
          </p>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ══════════════════════════════
              LEFT — EDIT PROFILE
          ══════════════════════════════ */}
          <div className="lg:w-80 xl:w-96 space-y-5">
            {/* Avatar card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              {/* Avatar circle */}
              <div className="relative inline-block mb-4">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden bg-orange-100
                                border-4 border-orange-200 mx-auto"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={() => setAvatarPreview("")}
                    />
                  ) : (
                    // Fallback — show initials
                    <div
                      className="w-full h-full flex items-center justify-center
                                    bg-orange-500"
                    >
                      <span className="text-white text-3xl font-bold">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Camera button overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={savingProfile}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 hover:bg-orange-600
                             rounded-full flex items-center justify-center text-white
                             shadow-md transition-colors"
                  title="Change photo"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <h2 className="font-bold text-gray-900 text-lg">
                {profile?.full_name || "User"}
              </h2>
              <p className="text-gray-400 text-sm">{profile?.email}</p>

              {/* Role badge */}
              <span
                className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  profile?.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {profile?.role === "admin" ? "🔑 Admin" : "👤 Customer"}
              </span>
            </div>

            {/* Edit form card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                Edit Information
              </h3>

              <div className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      disabled={savingProfile}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-orange-400
                                 text-gray-800 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                {/* Email — read only, managed by Supabase Auth */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl
                                 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={savingProfile}
                      placeholder="08012345678"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-orange-400
                                 text-gray-800 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={savingProfile}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300
                             text-white font-semibold rounded-xl transition-all duration-200
                             flex items-center justify-center gap-2"
                >
                  {savingProfile ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════
              RIGHT — ORDER HISTORY
          ══════════════════════════════ */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
                Order History
                {!loadingOrders && (
                  <span className="ml-auto text-sm text-gray-400 font-normal">
                    {orders.length} order{orders.length !== 1 ? "s" : ""}
                  </span>
                )}
              </h3>

              {/* Loading skeletons */}
              {loadingOrders && (
                <div className="space-y-3">
                  <OrderSkeleton />
                  <OrderSkeleton />
                  <OrderSkeleton />
                </div>
              )}

              {/* Error state */}
              {ordersError && (
                <div
                  className="flex items-center gap-3 p-4 bg-red-50 border
                                border-red-200 rounded-2xl text-red-600"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{ordersError}</p>
                </div>
              )}

              {/* Empty state */}
              {!loadingOrders && !ordersError && orders.length === 0 && (
                <div className="text-center py-12">
                  <div
                    className="w-16 h-16 bg-orange-100 rounded-full flex items-center
                                  justify-center mx-auto mb-4"
                  >
                    <ShoppingBag className="w-8 h-8 text-orange-300" />
                  </div>
                  <p className="text-gray-600 font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Your order history will appear here
                  </p>
                </div>
              )}

              {/* Orders list */}
              {!loadingOrders && orders.length > 0 && (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 rounded-2xl p-4 hover:border-orange-200
                                 transition-colors"
                    >
                      <div className="flex gap-3">
                        {/* Restaurant image */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {order.restaurants?.image_url ? (
                            <img
                              src={order.restaurants.image_url}
                              alt={order.restaurants.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Order info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-800 text-sm truncate">
                              {order.restaurants?.name || "Restaurant"}
                            </h4>
                            <StatusBadge status={order.status} />
                          </div>

                          {/* Items summary */}
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {order.items
                              ?.map((i) => `${i.name} ×${i.quantity}`)
                              .join(", ")}
                          </p>

                          {/* Date + total */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {formatDate(order.created_at)}
                            </span>
                            <span className="font-bold text-orange-500 text-sm">
                              {formatPrice(order.total_amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
