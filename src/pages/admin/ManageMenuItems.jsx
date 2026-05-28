// ============================================
// src/pages/admin/ManageMenuItems.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { getAllRestaurants } from "../../api/restaurantApi";
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} from "../../api/menuApi";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  UtensilsCrossed,
  Search,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Starters",
  "Main Course",
  "Sides",
  "Drinks",
  "Desserts",
  "Snacks",
  "Other",
];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "Main Course",
  image_url: "",
  is_available: true,
  restaurant_id: "",
};

export default function ManageMenuItems() {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [rests, items] = await Promise.all([
          getAllRestaurants(),
          getAllMenuItems(),
        ]);
        setRestaurants(rests || []);
        setMenuItems(items || []);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      restaurant_id:
        selectedRestaurant !== "all"
          ? selectedRestaurant
          : restaurants[0]?.id || "",
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "Main Course",
      image_url: item.image_url || "",
      is_available: item.is_available ?? true,
      restaurant_id: item.restaurant_id || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.restaurant_id) {
      toast.error("Name, price, and restaurant are required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editing) {
        const updated = await updateMenuItem(editing.id, payload);
        setMenuItems((prev) =>
          prev.map((i) =>
            i.id === editing.id
              ? { ...updated, restaurants: editing.restaurants }
              : i,
          ),
        );
        toast.success("Menu item updated");
      } else {
        const created = await createMenuItem(payload);
        const rest = restaurants.find((r) => r.id === payload.restaurant_id);
        setMenuItems((prev) => [
          { ...created, restaurants: rest ? { name: rest.name } : null },
          ...prev,
        ]);
        toast.success("Menu item added");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = await toggleMenuItemAvailability(
        item.id,
        !item.is_available,
      );
      setMenuItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_available: updated.is_available } : i,
        ),
      );
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Item deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = menuItems.filter((item) => {
    const matchRest =
      selectedRestaurant === "all" || item.restaurant_id === selectedRestaurant;
    const matchSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase());
    return matchRest && matchSearch;
  });

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
            Menu Items
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {menuItems.length} total items across all restaurants
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Item
        </button>
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
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-56 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <select
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="all">All Restaurants</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3">Item</th>
                <th className="text-left px-6 py-3">Restaurant</th>
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-left px-6 py-3">Price</th>
                <th className="text-left px-6 py-3">Available</th>
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
                    <UtensilsCrossed
                      size={32}
                      className="mx-auto mb-2 opacity-30"
                    />
                    No menu items found
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                            <UtensilsCrossed
                              size={14}
                              className="text-orange-400"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {item.restaurants?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₦{(item.price || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(item)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          item.is_available
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {item.is_available ? (
                          <ToggleRight size={13} />
                        ) : (
                          <ToggleLeft size={13} />
                        )}
                        {item.is_available ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item)}
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
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-bold text-gray-900 text-lg">
                {editing ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Restaurant *">
                <select
                  className={inputClass}
                  value={form.restaurant_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, restaurant_id: e.target.value }))
                  }
                >
                  <option value="">Select restaurant</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Item Name *">
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Jollof Rice"
                />
              </Field>

              <Field label="Category">
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Price (₦) *">
                <input
                  type="number"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="e.g. 2500"
                  min="0"
                />
              </Field>

              <div className="md:col-span-2">
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
              </div>

              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Short description..."
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Available
                </label>
                <button
                  onClick={() =>
                    setForm((f) => ({ ...f, is_available: !f.is_available }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.is_available ? "bg-orange-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_available ? "translate-x-5" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              Delete Item?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              <strong>{deleteConfirm.name}</strong> will be permanently deleted.
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
