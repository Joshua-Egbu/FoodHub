// ============================================
// src/pages/admin/ManageUsers.jsx
// ============================================
import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  deactivateUser,
  reactivateUser,
  deleteUser,
} from "../../api/userApi";
import {
  Trash2,
  Search,
  Users,
  ShieldCheck,
  UserX,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDeactivate = async (user) => {
    try {
      await deactivateUser(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: false } : u)),
      );
      toast.success(`${user.full_name} deactivated`);
    } catch {
      toast.error("Failed to deactivate user");
    }
  };

  const handleReactivate = async (user) => {
    try {
      await reactivateUser(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: true } : u)),
      );
      toast.success(`${user.full_name} reactivated`);
    } catch {
      toast.error("Failed to reactivate user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && u.is_active) ||
      (filterStatus === "inactive" && !u.is_active);
    return matchSearch && matchRole && matchStatus;
  });

  const totalActive = users.filter((u) => u.is_active).length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Users
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {users.length} total · {totalActive} active · {totalAdmins} admins
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3">User</th>
                <th className="text-left px-6 py-3">Phone</th>
                <th className="text-left px-6 py-3">Role</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Joined</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i}>
                      {Array(6)
                        .fill(0)
                        .map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                          </td>
                        ))}
                    </tr>
                  ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm uppercase">
                            {user.full_name?.[0] || "?"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.full_name || "—"}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {user.phone || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.role === "admin" && <ShieldCheck size={11} />}
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(user.created_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role !== "admin" &&
                          (user.is_active ? (
                            <button
                              onClick={() => handleDeactivate(user)}
                              title="Deactivate user"
                              className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            >
                              <UserX size={15} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivate(user)}
                              title="Reactivate user"
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <UserCheck size={15} />
                            </button>
                          ))}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        {user.role === "admin" && (
                          <span className="text-xs text-gray-300 italic">
                            Protected
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              Delete User?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              <strong>{deleteConfirm.full_name}</strong> ({deleteConfirm.email})
              will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
