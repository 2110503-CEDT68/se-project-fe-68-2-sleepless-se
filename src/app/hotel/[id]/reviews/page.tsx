'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import getReviews from '@/libs/getReviews';
import getHotel from '@/libs/getHotel';
import ReviewCard from '@/components/ReviewCard';
import type { Review } from '../../../../../interface';

export default function AllReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();

  const [hotelName, setHotelName] = useState('Hotel');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [hotel, reviewsRes] = await Promise.all([
        getHotel(id),
        getReviews(id),
      ]);
      setHotelName(hotel?.hotel_name ?? 'Hotel');
      setReviews(reviewsRes?.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const availableRatings = [...new Set(reviews.map((r) => r.rating))].sort((a, b) => b - a);

  const displayed = [...reviews]
    .filter((r) => filterRating === null || r.rating === filterRating)
    .sort((a, b) => sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 pt-28 pb-10 flex justify-center items-start">
        <p className="text-slate-400 animate-pulse">Loading reviews...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pt-28 pb-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 leading-tight">All reviews of</h1>
            <h1 className="text-2xl font-bold text-slate-800">{hotelName}</h1>
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="mt-1 px-3 py-2 rounded-lg bg-slate-400 text-white text-sm font-medium cursor-pointer focus:outline-none"
          >
            <option value="desc">rating ↓</option>
            <option value="asc">rating ↑</option>
          </select>
        </div>

        {/* Star filter buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              filterRating === null
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500'
            }`}
          >
            All
          </button>
          {availableRatings.map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                filterRating === star
                  ? 'bg-yellow-400 text-white border-yellow-400'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-yellow-400'
              }`}
            >
              {'★'.repeat(star)} {star} stars
            </button>
          ))}
        </div>

        {/* Review cards */}
        <div className="flex flex-col gap-3">
          {displayed.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-10">
              {reviews.length === 0 ? 'No reviews yet.' : 'No reviews for this rating.'}
            </p>
          ) : (
            displayed.map((review) => {
              const authorId = typeof review.user === 'object' ? review.user._id : review.user;
              const userName = typeof review.user === 'object' ? review.user.name : 'User';
              return (
                <ReviewCard
                  key={review._id}
                  hotelId={id}
                  reviewId={review._id}
                  userName={userName}
                  comment={review.comment}
                  rating={review.rating}
                  status={review.status}
                  authorId={authorId}
                  currentUserId={(session?.user as any)?._id || (session?.user as any)?.id || (session?.user as any)?.sub}
                  currentUserRole={(session?.user as any)?.role}
                  token={session?.user?.token}
                  onRefresh={load}
                />
              );
            })
          )}
        </div>

        <div className="mt-6">
          <Link href={`/hotel/${id}`} className="text-slate-500 text-sm hover:text-slate-700 transition-colors">
            ← Back to hotel
          </Link>
        </div>
      </div>
    </main>
  );
}