'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import getReviews from '@/libs/getReviews';
import getHotel from '@/libs/getHotel';

import ReviewCard from '@/components/ReviewCard';
import RatingDistributionBar from '@/components/RatingDistributionBar';
import ReportModal from '@/components/ReportModal';

import type { Review } from '../../../../../interface';

export default function AllReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();

  const [hotelData, setHotelData] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const [reviewStats, setReviewStats] = useState({
    totalCount: 0,
    avgRating: 0,
    starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
  });

  const limit = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const handleReportSubmit = async (reviewId: string, reason: string) => {
    try {
      const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/reviews/${reviewId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Reported successfully!");
        setIsModalOpen(false); 
        loadReviews();
      } else {
        alert(data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error("Report Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  const loadReviews = async () => {
    setLoading(true);
    try {
      const [hotel, reviewsRes] = await Promise.all([
        getHotel(id),
        getReviews(id, {
          page,
          limit,
          sort: sortOrder,
          rating: filterRating
        }),
      ]);

      setHotelData(hotel);
      setReviews(reviewsRes?.data ?? []);
      setTotalPages(reviewsRes?.totalPages ?? 1);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await getReviews(id);
      const allReviews = res?.data ?? [];

      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;

      allReviews.forEach((r: any) => {
        if (r.rating >= 1 && r.rating <= 5) {
          counts[r.rating]++;
          totalRating += r.rating;
        }
      });

      setReviewStats({
        totalCount: allReviews.length,
        avgRating: allReviews.length ? totalRating / allReviews.length : 0,
        starCounts: counts
      });

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) loadReviews();
  }, [id, page, sortOrder, filterRating]);

  useEffect(() => {
    if (id) loadStats();
  }, [id]);

  useEffect(() => {
    setPage(1);
  }, [sortOrder, filterRating]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 pt-28 flex justify-center">
        <p className="text-slate-400 animate-pulse">Loading reviews...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pt-28 pb-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">

        <div className="flex items-center gap-4 mb-6">
          <Link href={`/hotel/${id}`} className="text-2xl">
            <div style={{ transform: "rotate(90deg) scaleX(2)", fontSize: "30px" }}> 
              v
            </div>
          </Link>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
              All reviews of
            </h1>
            <h1 className="text-2xl font-bold text-[#0369a1]">
              {hotelData?.hotel_name}
            </h1>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 rounded-lg bg-slate-400 text-white text-sm font-medium"
          >
            <option value="desc">rating ↓</option>
            <option value="asc">rating ↑</option>
          </select>
        </div>

        <div className="mb-6">
          {hotelData && (
          <RatingDistributionBar
            starCounts={reviewStats.starCounts}
            totalCount={reviewStats.totalCount}
            avgRating={reviewStats.avgRating}
            imageURL={hotelData.imageURL}
            onStarClick={(star) => setFilterRating(star)}
            selectedStar={filterRating}
          />
        )}
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3 py-1 rounded-full text-sm border ${
              filterRating === null
                ? 'bg-slate-700 text-white'
                : 'bg-white text-slate-600'
            }`}
          >
            All
          </button>

          {[5,4,3,2,1].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1 rounded-full text-sm border ${
                filterRating === star
                  ? 'bg-yellow-400 text-white'
                  : 'bg-white text-slate-600'
              }`}
            >
              {'★'.repeat(star)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {reviews.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-10">
              No reviews found.
            </p>
          ) : (
            reviews.map((review) => {
              const authorId =
                typeof review.user === 'object'
                  ? review.user._id
                  : review.user;

              const userName =
                typeof review.user === 'object'
                  ? review.user.name
                  : 'User';

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
                  currentUserId={
                    (session?.user as any)?._id ||
                    (session?.user as any)?.id ||
                    (session?.user as any)?.sub
                  }
                  currentUserRole={(session?.user as any)?.role}
                  currentUserHotelId={(session?.user as any)?.hotel} 
                  token={session?.user?.token}
                  onRefresh={loadReviews}
                  onOpenReport={() => {
                    setSelectedReviewId(review._id);
                    setIsModalOpen(true);
                  }}
                />
              );
            })
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-slate-600">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <ReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReportSubmit}
          reviewId={selectedReviewId}
        />

      </div>
    </main>
  );
}