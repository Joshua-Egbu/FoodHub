// ============================================
// src/pages/admin/ManageReviews.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { getAllReviews, deleteReview } from "../../api/reviewApi";
import { Trash2, Star, Search, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const StarDisplay = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={13}
        className={
          n <= rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-200 fill-gray-200"
        }
      />
    ))}
  </div>
);

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllReviews();
        setReviews(data || []);
      } catch {
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.comment?.toLowerCase().includes(search.toLowerCase()) ||
      r.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.restaurants?.name?.toLowerCase().includes(search.toLowerCase());
    const matchRating =
      filterRating === "all" || r.rating === parseInt(filterRating);
    return matchSearch && matchRating;
  });

  const avgRating = reviews.length
    ? (
        reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
      ).toFixed(1)
    : "—";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Reviews
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {reviews.length} total · avg rating {avgRating} ⭐
          </p>
        </div>
      </div>

      {/* Rating Summary Pills */}
      <div className="flex gap-3 flex-wrap">
        {["all", "5", "4", "3", "2", "1"].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRating(r)}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors ${
              filterRating === r
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
            }`}
          >
            {r === "all" ? "All Stars" : `${r} ★`}
            <span className="ml-1.5 text-xs opacity-70">
              (
              {r === "all"
                ? reviews.length
                : reviews.filter((x) => x.rating === parseInt(r)).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by reviewer, restaurant, or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3">Reviewer</th>
                <th className="text-left px-6 py-3">Restaurant</th>
                <th className="text-left px-6 py-3">Rating</th>
                <th className="text-left px-6 py-3">Comment</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Action</th>
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
                    <MessageSquare
                      size={32}
                      className="mx-auto mb-2 opacity-30"
                    />
                    No reviews found
                  </td>
                </tr>
              ) : (
                filtered.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs uppercase">
                          {review.profiles?.full_name?.[0] || "?"}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {review.profiles?.full_name || "Anonymous"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {review.restaurants?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StarDisplay rating={review.rating} />
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      <p className="truncate">
                        {review.comment || (
                          <span className="italic text-gray-300">
                            No comment
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(review.created_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDeleteConfirm(review)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
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
              Delete Review?
            </h3>
            <p className="text-gray-500 text-sm mb-2">
              Review by{" "}
              <strong>
                {deleteConfirm.profiles?.full_name || "Anonymous"}
              </strong>
            </p>
            {deleteConfirm.comment && (
              <p className="text-xs text-gray-400 italic mb-5 line-clamp-2">
                "{deleteConfirm.comment}"
              </p>
            )}
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
