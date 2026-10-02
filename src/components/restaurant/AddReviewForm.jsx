// ============================================
// src/components/restaurant/AddReviewForm.jsx
// ============================================
// Form for logged-in users to submit a review.
// Features:
//   - Interactive star rating picker
//   - Comment textarea
//   - Loading state on submit
//   - Optimistic UI update (adds review immediately)
//
// Props:
//   restaurantId → which restaurant to review
//   onReviewAdded → callback with the new review object
//                   so parent can add it to the list
//                   without refetching all reviews
// ============================================

import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { addReview } from "../../api/reviewApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AddReviewForm = ({ restaurantId, onReviewAdded }) => {
  const { user, profile } = useAuth();

  const [rating, setRating] = useState(0); // selected star rating
  const [hoverRating, setHoverRating] = useState(0); // star being hovered
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── HANDLE SUBMIT ───────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview = await addReview({
        restaurant_id: restaurantId,
        user_id: user.id,
        rating: rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted! Thank you 🙏");

      // Tell the parent component about the new review
      // so it can add it to the top of the list
      // without making another network request
      if (onReviewAdded) onReviewAdded(newReview);

      // Reset form
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not logged in, show a prompt instead of the form
  if (!user) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
        <p className="text-gray-600 text-sm">
          Please{" "}
          <a
            href="/login"
            className="text-orange-500 font-semibold hover:underline"
          >
            log in
          </a>{" "}
          to leave a review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── STAR RATING PICKER ── */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-125"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    // Fill star if it's within hover or selected rating
                    star <= (hoverRating || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                />
              </button>
            ))}
            {/* Show rating label text */}
            {(hoverRating || rating) > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                {
                  ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                    hoverRating || rating
                  ]
                }
              </span>
            )}
          </div>
        </div>

        {/* ── COMMENT TEXTAREA ── */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Your Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this restaurant..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-orange-400
                       focus:border-transparent text-gray-800 placeholder-gray-400
                       text-sm resize-none transition-all"
          />
          {/* Character count hint */}
          <p className="text-xs text-gray-400 mt-1 text-right">
            {comment.length} characters{" "}
            {comment.length < 10 ? "(minimum 10)" : "✓"}
          </p>
        </div>

        {/* ── SUBMIT BUTTON ── */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600
                     disabled:bg-orange-300 text-white font-semibold rounded-xl
                     transition-all duration-200 text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
