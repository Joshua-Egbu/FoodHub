// ============================================
// src/pages/admin/ManageRestaurants.jsx
// ============================================
import React, { useEffect, useState } from "react";
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../../api/restaurantApi";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Store,
  ToggleLeft,
  ToggleRight,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import supabase from "../../supabaseClient";

const CUISINES = [
  "Nigerian",
  "Chinese",
  "Italian",
  "Indian",
  "American",
  "Lebanese",
  "Continental",
  "Other",
];

const EMPTY_FORM = {
  name: "",
  description: "",
  cuisine: "Nigerian",
  image_url: "",
  address: "",
  opening_time: "8:00 AM",
  closing_time: "10:00 PM",
  delivery_time: "20-35 mins",
  delivery_fee: "",
  is_active: true,
};

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, object = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = async () => {
    try {
      const data = await getAllRestaurants();
      setRestaurants(data || []);
    } catch {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      name: r.name || "",
      description: r.description || "",
      cuisine: r.cuisine || "Nigerian",
      image_url: r.image_url || "",
      address: r.address || "",
      opening_time: r.opening_time || "8:00 AM",
      closing_time: r.closing_time || "10:00 PM",
      delivery_time: r.delivery_time || "20-35 mins",
      delivery_fee: r.delivery_fee || "",
      is_active: r.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.cuisine || !form.address.trim()) {
      toast.error("Name, cuisine, and address are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        delivery_fee: parseFloat(form.delivery_fee) || 0,
      };
      if (editing) {
        const updated = await updateRestaurant(editing.id, payload);
        setRestaurants((prev) =>
          prev.map((r) => (r.id === editing.id ? updated : r)),
        );
        toast.success("Restaurant updated");
      } else {
        const created = await createRestaurant(payload);
        setRestaurants((prev) => [created, ...prev]);
        toast.success("Restaurant added");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (r) => {
    try {
      const updated = await updateRestaurant(r.id, { is_active: !r.is_active });
      setRestaurants((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
      toast.success(
        `Restaurant ${updated.is_active ? "activated" : "deactivated"}`,
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      toast.success("Restaurant deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(search.toLowerCase()),
  );

  const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );

  const inputClass =
    "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Restaurants
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {restaurants.length} total restaurants
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Restaurant
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name or cuisine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3">Restaurant</th>
                <th className="text-left px-6 py-3">Cuisine</th>
                <th className="text-left px-6 py-3">Delivery Fee</th>
                <th className="text-left px-6 py-3">Hours</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5)
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
                    <Store size={32} className="mx-auto mb-2 opacity-30" />
                    No restaurants found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {r.image_url ? (
                          <img
                            src={r.image_url}
                            alt={r.name}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Store size={16} className="text-orange-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{r.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">
                            {r.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                        {r.cuisine}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₦{(r.delivery_fee || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {r.opening_time} – {r.closing_time}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(r)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          r.is_active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {r.is_active ? (
                          <ToggleRight size={13} />
                        ) : (
                          <ToggleLeft size={13} />
                        )}
                        {r.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(r)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-bold text-gray-900 text-lg">
                {editing ? "Edit Restaurant" : "Add Restaurant"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Name *">
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Mama Cass"
                />
              </Field>

              <Field label="Cuisine *">
                <select
                  className={inputClass}
                  value={form.cuisine}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cuisine: e.target.value }))
                  }
                >
                  {CUISINES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Address *">
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="e.g. 12 Allen Ave, Ikeja"
                />
              </Field>

              <Field label="Delivery Fee (₦)">
                <input
                  type="number"
                  className={inputClass}
                  value={form.delivery_fee}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, delivery_fee: e.target.value }))
                  }
                  placeholder="e.g. 500"
                  min="0"
                />
              </Field>

              <Field label="Opening Time">
                <input
                  className={inputClass}
                  value={form.opening_time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, opening_time: e.target.value }))
                  }
                  placeholder="8:00 AM"
                />
              </Field>

              <Field label="Closing Time">
                <input
                  className={inputClass}
                  value={form.closing_time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, closing_time: e.target.value }))
                  }
                  placeholder="10:00 PM"
                />
              </Field>

              <Field label="Delivery Time">
                <input
                  className={inputClass}
                  value={form.delivery_time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, delivery_time: e.target.value }))
                  }
                  placeholder="20-35 mins"
                />
              </Field>

              <Field label="Image URL">
                <input
                  className={inputClass}
                  value={form.image_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image_url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Short description of this restaurant..."
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Active
                </label>
                <button
                  onClick={() =>
                    setForm((f) => ({ ...f, is_active: !f.is_active }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? "bg-orange-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Add Restaurant"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              Delete Restaurant?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              <strong>{deleteConfirm.name}</strong> will be permanently deleted.
              This cannot be undone.
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
                className="flex-1 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
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
