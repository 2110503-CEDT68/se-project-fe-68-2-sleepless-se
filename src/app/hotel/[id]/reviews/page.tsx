'use client';

import { useState, useEffect, use, useMemo } from 'react';
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

  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [hotelData, setHotelData] = useState<any>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const limit = 5; // Number of reviews per page

  // Statistics State
  const [reviewStats, setReviewStats] = useState({
    totalCount: 0,
    avgRating: 0,
    starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  // ==========================================
  // 2. DATA FETCHING (ONCE PER MOUNT/REFRESH)
  // ==========================================
  /**
   * Fetches hotel details and all available reviews from the backend.
   * This allows us to perform high-performance sorting and filtering on the client side.
   */
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [hotelRes, reviewsRes] = await Promise.all([
        getHotel(id),
        getReviews(id), // Assuming this fetches all reviews without pagination params
      ]);

      setHotelData(hotelRes);

      const fetchedReviews: Review[] = reviewsRes?.data ?? [];
      setAllReviews(fetchedReviews);

      // Compute statistics directly from the source data
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;

      fetchedReviews.forEach((r: any) => {
        if (r.rating >= 1 && r.rating <= 5) {
          counts[r.rating]++;
          totalRating += r.rating;
        }
      });

      setReviewStats({
        totalCount: fetchedReviews.length,
        avgRating: fetchedReviews.length ? totalRating / fetchedReviews.length : 0,
        starCounts: counts,
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ==========================================
  // 3. CLIENT-SIDE DATA PROCESSING
  // ==========================================
  /**
   * useMemo is utilized here to avoid recalculating sorting and filtering
   * on every render, optimizing performance when interacting with other states.
   */
  const processedReviews = useMemo(() => {
    // 1. Filter by Rating
    let filtered = allReviews.filter((review) => {
      if (filterRating === null) return true;
      return review.rating === filterRating;
    });

    // 2. Sort by Rating
    filtered.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.rating - a.rating; // High to Low
      } else {
        return a.rating - b.rating; // Low to High
      }
    });

    return filtered;
  }, [allReviews, filterRating, sortOrder]);

  // Calculate Pagination Variables
  const totalPages = Math.ceil(processedReviews.length / limit) || 1;
  const startIndex = (page - 1) * limit;
  const currentDisplayedReviews = processedReviews.slice(startIndex, startIndex + limit);

  // ==========================================
  // 4. EVENT HANDLERS
  // ==========================================
  const handleSortChange = (val: 'asc' | 'desc') => {
    setSortOrder(val);
    setPage(1); // Reset to first page upon sorting change
  };

  const handleFilterChange = (star: number | null) => {
    setFilterRating(star);
    setPage(1); // Reset to first page upon filter change
  };

  const handleReportSubmit = async (reviewId: string, reason: string) => {
    try {
      const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Reported successfully!');
        setIsModalOpen(false);
        fetchAllData(); // Refresh data to reflect any status changes from the backend
      } else {
        alert(data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error('Report Error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  // ==========================================
  // 5. RENDER UI
  // ==========================================
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
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/hotel/${id}`} className="text-2xl">
            <div style={{ transform: 'rotate(90deg) scaleX(2)', fontSize: '30px' }}>
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

          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 rounded-lg bg-slate-400 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          >
            <option value="desc">Rating ↓</option>
            <option value="asc">Rating ↑</option>
          </select>
        </div>

        {/* Rating Distribution Bar Chart */}
        <div className="mb-6">
          {hotelData && (
            <RatingDistributionBar
              starCounts={reviewStats.starCounts}
              totalCount={reviewStats.totalCount}
              avgRating={reviewStats.avgRating}
              imageURL={hotelData.imageURL}
              onStarClick={(star) => handleFilterChange(star)}
              selectedStar={filterRating}
            />
          )}
        </div>

        {/* Rating Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => handleFilterChange(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterRating === null
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            All
          </button>

          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => handleFilterChange(star)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                filterRating === star
                  ? 'bg-yellow-400 text-white border-yellow-400'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {'★'.repeat(star)}
            </button>
          ))}
        </div>

        {/* Review Cards List */}
        <div className="flex flex-col gap-3 min-h-[300px]">
          {currentDisplayedReviews.length === 0 ? (
            <div className="flex items-center justify-center h-full py-10">
              <p className="text-slate-400 text-sm">No reviews found matching your filter.</p>
            </div>
          ) : (
            currentDisplayedReviews.map((review) => {
              // Safely extract user information depending on populated state
              const authorId =
                typeof review.user === 'object' ? review.user._id : review.user;
              const userName =
                typeof review.user === 'object' ? review.user.name : 'User';

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
                  onRefresh={fetchAllData}
                  onOpenReport={() => {
                    setSelectedReviewId(review._id);
                    setIsModalOpen(true);
                  }}
                />
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Prev
          </button>

          <span className="text-slate-600 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>

        {/* Report Reason Modal */}
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