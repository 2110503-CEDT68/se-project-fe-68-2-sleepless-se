<<<<<<< Updated upstream
import { Rating } from "@mui/material";

interface ReviewCardProps {
  name: string;
  comment: string;
  rating: number;
}

export default function ReviewCard({ name, comment, rating }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm flex-shrink-0">
        {name.charAt(0)}
      </div>

      {/* Content */}
      <div>
        <p className="font-semibold text-slate-800 text-sm">{name}</p>
        <p className="text-slate-500 text-sm italic">"{comment}"</p>
        <Rating value={rating} precision={0.5} readOnly size="small" />
      </div>
    </div>
  );
}
=======
'use client';

import { useState } from 'react';
import { Rating } from '@mui/material';
import updateReview from '@/libs/updateReview';
import deleteReview from '@/libs/deleteReview';

interface ReviewCardProps {
  hotelId: string;
  reviewId: string;
  userName: string;
  comment: string;
  rating: number;
  status?: string;
  authorId?: string;
  currentUserId?: string;
  currentUserRole?: string;
  token?: string;
  onRefresh?: () => void;
}

export default function ReviewCard({
  hotelId,
  reviewId,
  userName,
  comment,
  rating,
  status,
  authorId,
  currentUserId,
  currentUserRole,
  token,
  onRefresh,
}: ReviewCardProps) {
  const isOwner = !!currentUserId && currentUserId === authorId;
  const isAdmin = currentUserRole === 'admin';

  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(rating);
  const [editComment, setEditComment] = useState(comment);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!token) return;
    if (editRating === 0) { setError('Please select a star rating'); return; }
    setLoading(true);
    setError(null);
    try {
      await updateReview(hotelId, reviewId, editRating, editComment, token);
      setEditing(false);
      onRefresh?.();
    } catch (err: any) {
      setError(err.message || 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm('Delete this review? This cannot be undone.')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteReview(hotelId, reviewId, token);
      onRefresh?.();
    } catch (err: any) {
      setError(err.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditRating(rating);
    setEditComment(comment);
    setError(null);
  };

  const statusBadge =
    isAdmin && status && status !== 'active' ? (
      <span
        className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
          status === 'hidden' ? 'bg-slate-200 text-slate-500' : 'bg-red-100 text-red-500'
        }`}
      >
        {status}
      </span>
    ) : null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex gap-4 items-start w-full">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-lg shrink-0">
        {userName.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap mb-1">
          <span className="font-bold text-slate-800 text-sm">{userName}</span>
          {statusBadge}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="flex gap-0.5" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setEditRating(star)}
                  className="p-0.5 focus:outline-none transition-transform hover:scale-110 bg-transparent border-none"
                >
                  <svg
                    className={`w-7 h-7 ${star <= (hoverRating || editRating) ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />

            {error && <p className="text-xs text-red-500" role="alert">{error}</p>}

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-600 text-sm italic mb-1.5">"{comment}"</p>
            <Rating value={rating} readOnly size="small" />
          </>
        )}

        {error && !editing && (
          <p className="text-xs text-red-500 mt-1" role="alert">{error}</p>
        )}
      </div>

      {/* Actions */}
      {!editing && (isOwner || isAdmin) && (
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => setEditing(true)}
            disabled={loading}
            className="px-3 py-1 rounded-md text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-colors disabled:opacity-50 w-16 text-center"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 rounded-md text-xs font-semibold bg-red-400 hover:bg-red-500 text-white transition-colors disabled:opacity-50 w-16 text-center"
          >
            {loading ? '…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
>>>>>>> Stashed changes
