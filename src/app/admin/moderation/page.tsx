'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ModerationActions from '@/components/ModerationActions';
import type { ReviewStatus } from '../../../../interface';

type TabKey = 'all' | 'rejected' | 'hidden';

interface ReviewItem {
  _id: string;
  hotel: { _id: string; hotel_name: string } | string;
  user: { _id: string; name: string } | string;
  rating: number;
  comment: string;
  status?: ReviewStatus;
  createdAt: string;
}

function AvatarInitial({ name }: { name: string }) {
  const initial = name?.charAt(0)?.toUpperCase() ?? '?';
  return (
    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
      {initial}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={s <= rating ? 'text-yellow-400' : 'text-slate-200'}>★</span>
      ))}
    </span>
  );
}

const TAB_LABELS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'all' },
  { key: 'rejected', label: 'rejected' },
  { key: 'hidden', label: 'hidden' },
];

export default function ModerationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/api/auth/signin'); return; }
    if (status === 'authenticated') {
      if ((session?.user as any)?.role !== 'admin') { router.push('/'); return; }
      fetchAllReviews();
    }
  }, [status, session]);

  const fetchAllReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://hotelbooking-kwtf.onrender.com/api/v1/reviews', {
        headers: { Authorization: `Bearer ${(session?.user as any)?.token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data.data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActionComplete = (
    reviewId: string,
    action: 'delete' | 'hide' | 'unhide' | 'reject' | 'approve'
  ) => {
    if (action === 'delete' || action === 'reject') {
      setReviews((prev) =>
        prev.map((r) => r._id === reviewId ? { ...r, status: 'rejected' } : r)
      );
      return;
    }
    const nextStatus: ReviewStatus =
      action === 'hide' ? 'hidden' :
      action === 'approve' ? 'active' : 'active';
    setReviews((prev) =>
      prev.map((r) => r._id === reviewId ? { ...r, status: nextStatus } : r)
    );
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'rejected') return r.status === 'rejected';
    if (activeTab === 'hidden') return r.status === 'hidden';
    return true;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-extrabold text-slate-800">Moderation Panel</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage all hotel review content</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Tab row */}
          <div className="flex items-center border-b border-slate-100 px-4 pt-4 gap-1">
            <span className="text-sm font-bold text-slate-700 mr-3">All reviews</span>
            {TAB_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-1.5 rounded-t-lg text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Review list */}
          <div className="divide-y divide-slate-50">
            {filteredReviews.length === 0 ? (
              <p className="text-center text-slate-300 py-12 text-sm">No reviews here.</p>
            ) : (
              filteredReviews.map((review) => {
                const userName =
                  typeof review.user === 'object' ? review.user.name : 'User';
                const currentStatus: ReviewStatus = review.status ?? 'active';

                return (
                  <div key={review._id} className="flex items-start gap-3 px-4 py-4">
                    <AvatarInitial name={userName} />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-700 text-sm">{userName}</p>
                      <p className="text-xs text-slate-400 italic truncate">"{review.comment}"</p>
                      <StarRow rating={review.rating} />
                    </div>

                    <ModerationActions
                      reviewId={review._id}
                      currentStatus={currentStatus}
                      token={(session?.user as any)?.token ?? ''}
                      onActionComplete={handleActionComplete}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}