// ============================================
// src/pages/admin/AdminDashboard.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import { getAllUsers } from "../../api/userApi";
import {
  ShoppingBag,
  Users,
  Store,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import supabase from "../../supabaseClient";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
};

const STATUS_ICONS = {
  pending: <Clock size={12} />,
  confirmed: <AlertCircle size={12} />,
  delivered: <CheckCircle size={12} />,
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersData, usersData] = await Promise.all([
          getAllOrders(),
          getAllUsers(),
        ]);
        const { data: restData } = await supabase
          .from("restaurants")
          .select("id, name, is_active");
        const { data: reviewData } = await supabase
          .from("reviews")
          .select("id");
        setOrders(ordersData || []);
        setUsers(usersData || []);
        setRestaurants(restData || []);
        setReviews(reviewData || []);
      } catch (err) {
        toast.error("Failed to load dashboard data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      sub: `${orders.filter((o) => o.status === "pending").length} pending`,
      icon: <ShoppingBag size={22} />,
      color: "bg-orange-50 text-orange-600",
      border: "border-orange-200",
    },
    {
      label: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      sub: "from delivered orders",
      icon: <TrendingUp size={22} />,
      color: "bg-green-50 text-green-600",
      border: "border-green-200",
    },
    {
      label: "Users",
      value: users.length,
      sub: `${users.filter((u) => u.is_active).length} active`,
      icon: <Users size={22} />,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-200",
    },
    {
      label: "Restaurants",
      value: restaurants.length,
      sub: `${restaurants.filter((r) => r.is_active).length} active`,
      icon: <Store size={22} />,
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-200",
    },
    {
      label: "Reviews",
      value: reviews.length,
      sub: "total submitted",
      icon: <Star size={22} />,
      color: "bg-yellow-50 text-yellow-600",
      border: "border-yellow-200",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
        </div>
        <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl border ${stat.border} p-4 flex flex-col gap-3 shadow-sm`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        {["pending", "confirmed", "delivered"].map((status) => (
          <div
            key={status}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center"
          >
            <p className="text-3xl font-bold text-gray-900">
              {orders.filter((o) => o.status === status).length}
            </p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mt-2 capitalize ${STATUS_COLORS[status]}`}
            >
              {STATUS_ICONS[status]} {status}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <span className="text-xs text-gray-400">Last 10 orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3">Order ID</th>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Restaurant</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.profiles?.full_name ||
                        order.user_id?.slice(0, 8) ||
                        "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.restaurants?.name || "—"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₦{(order.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUS_ICONS[order.status]}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
