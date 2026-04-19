'use client'

import { useState } from 'react';
import type { ModerationActionsProps } from '../../interface';

export default function ModerationActions({
  reviewId,
  currentStatus,
  token,
  onActionComplete,
}: ModerationActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (
    method: string,
    path: string,
    action: 'delete' | 'hide' | 'unhide' | 'reject' | 'approve'
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://se-be-9w6y.onrender.com/api/v1/reviews/${reviewId}${path}`,
        { method, headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${action}`);
      }
      onActionComplete(reviewId, action);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this review?')) return;
    callApi('DELETE', '', 'delete');
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      {error && (
        <span className="text-xs text-red-500" role="alert">{error}</span>
      )}

      <div className="flex flex-col gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          aria-label="Delete review"
          className="px-3 py-1 rounded-md text-xs font-semibold bg-red-400 hover:bg-red-500 text-white transition-colors disabled:opacity-50 w-20 text-center"
        >
          report
        </button>

        {currentStatus === 'hidden' ? (
          <button
            onClick={() => callApi('PATCH', '/unhide', 'unhide')}
            disabled={loading}
            aria-label="Unhide review"
            className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-500 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 w-20 text-center"
          >
            unhide
          </button>
        ) : (
          <button
            onClick={() => callApi('PATCH', '/hide', 'hide')}
            disabled={loading}
            aria-label="Hide review"
            className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-500 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 w-20 text-center"
          >
            hide
          </button>
        )}

        <button
          onClick={() => callApi('PATCH', '/approve', 'approve')}
          disabled={loading || currentStatus === 'active'}
          aria-label="Approve review"
          className="px-3 py-1 rounded-md text-xs font-semibold bg-green-400 hover:bg-green-500 text-white transition-colors disabled:opacity-40 w-20 text-center"
        >
          approve
        </button>
      </div>
    </div>
  );
}