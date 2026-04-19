"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import getHotel from "@/libs/getHotel";
import getReviews from "@/libs/getReviews";
import ReviewModal from "@/components/ReviewModal";
import StarFilterTabs, {
  filterReviewsByStar,
  computeStarCounts,
} from "@/components/StarFilterTabs";
import RatingDistributionBar from "@/components/RatingDistributionBar";
import type { Hotel, Review } from "../../../../interface";

const hotelImageMap: Record<string, string> = {
  "Rayong Sand Beach": "/img/rayong_sand_beach.jpg",
  "Trat Station Hotel": "/img/trat_station.jpg",
  "Sukhothai Old Town Guest": "/img/sukhothai.jpg",
  "Lopburi Monkey Inn": "/img/monkey.jpg",
  "Songkhla Mermaid Hotel": "/img/songkhla.jpg",
  "Grand Bangkok Hotel": "/img/grandbangkok.jpg",
  "Pai Mist Boutique": "/img/pai.jpg",
  "Udon Thani Central Park": "/img/udon_thani.jpg",
  "Trat Islands Hotel": "/img/trat_island.jpg",
  "Nan Hidden Gem": "/img/nan_hidden.jpeg",
  "Sea View Resort": "/img/sea_view.jpg",
  "Krabi Cliff Resort": "/img/krabi.jpg",
  "Ayutthaya Heritage Hotel": "/img/ayutthaya.jpg",
  "Khao Yai Nature Lodge": "/img/khaoyai.jpg",
  "Samui Sunset Villa": "/img/samui.jpg",
  "Hua Hin Blue Lagoon": "/img/huahin.jpg",
  "Isan Charm Resort": "/img/isan.jpg",
  "River Kwai Bridge Hotel": "/img/riverkwai.jpg",
  "Phuket Paradise": "/img/phuket.jpg",
  "Mountain Inn": "/img/mountain_inn.jpg",
};

function StarRow({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const cls = size === "md" ? "text-base" : "text-sm";
  return (
    <span className={cls}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={s <= rating ? "text-yellow-400" : "text-slate-200"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function AvatarInitial({ name }: { name: string }) {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
      {initial}
    </div>
  );
}

export default function HotelDetailPage() {
  const params = useParams();
  const hotelId = params?.id as string;
  const { data: session } = useSession();
  const router = useRouter();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const [hotelRes, reviewsRes] = await Promise.all([
        getHotel(hotelId),
        getReviews(hotelId),
      ]);
      // getHotel คืน null เมื่อไม่พบ หรือ API ล้ม
      setHotel(hotelRes?.data ?? null);
      setReviews(reviewsRes?.data ?? []);
      setAvgRating(
        reviewsRes?.avgRating ? parseFloat(reviewsRes.avgRating) : null,
      );
    } catch (err) {
      console.error(err);
      setHotel(null);
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!session?.user?.token) {
      router.push("/api/auth/signin");
      return;
    }
    setSubmitError(null);
    try {
      const res = await fetch(
        `https://hotelbooking-kwtf.onrender.com/api/v1/hotels/${hotelId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({ rating, comment }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to submit review");
      setIsReviewOpen(false);
      fetchData();
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-400 text-lg font-semibold">Hotel not found.</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-sky-500 hover:underline"
        >
          ← Go back
        </button>
      </div>
    );
  }

  const starCounts = computeStarCounts(reviews);
  const filtered = filterReviewsByStar(reviews, selectedStar);
  const imageUrl = hotelImageMap[hotel.hotel_name] ?? "/img/sukhothai.jpg";

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* ── Top nav breadcrumb ── */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 hover:text-sky-600 text-sm transition-colors"
        >
          <span className="text-base">‹</span>
          <span className="font-medium">{hotel.hotel_name}</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6 pb-20">
        {/* ── Hotel info card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Photo */}
            <div className="relative w-full sm:w-56 h-48 sm:h-auto flex-shrink-0 bg-slate-200">
              <Image
                src={imageUrl}
                alt={hotel.hotel_name}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 p-5 space-y-2">
              <h1 className="text-xl font-extrabold text-slate-800">
                {hotel.hotel_name}
              </h1>

              <div className="space-y-1 text-sm text-slate-500">
                <p className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>
                    {hotel.address}
                    {hotel.district ? `, ${hotel.district}` : ""}
                    {hotel.province ? `, ${hotel.province}` : ""}
                  </span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span>📞</span>
                  <span>{hotel.telephone || "–"}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span>✉️</span>
                  <span>
                    {hotel.hotel_name.toLowerCase().replace(/\s+/g, "")}
                    @hotel.com
                  </span>
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {hotel.region ? `${hotel.region} region — ` : ""}
                {hotel.district ?? ""}
                {hotel.province ? `, ${hotel.province}` : ""}{" "}
                {hotel.postalcode ?? ""}
              </p>

              {/* Rating row + buttons */}
              <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <StarRow rating={Math.round(avgRating ?? 0)} size="md" />
                  <span className="text-sm text-slate-500 font-medium">
                    {avgRating !== null
                      ? `${avgRating.toFixed(1)} out of 5 stars`
                      : "No ratings yet"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!session) {
                        router.push("/api/auth/signin");
                        return;
                      }
                      setIsReviewOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors"
                  >
                    Review
                  </button>
                  <Link href={`/booking?hotel=${hotel._id}`}>
                    <button className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition-colors">
                      Book
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Rating Distribution + Star Filter ── */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            {/* Distribution bar */}
            <RatingDistributionBar
              starCounts={starCounts}
              totalCount={reviews.length}
              avgRating={avgRating}
            />

            {/* Displaying label + filter tabs */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100">
              {selectedStar !== null && (
                <span className="px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold">
                  Displaying: {"★".repeat(selectedStar)}
                </span>
              )}
              <StarFilterTabs
                selectedStar={selectedStar}
                onSelectStar={setSelectedStar}
                starCounts={starCounts}
              />
              {selectedStar !== null && (
                <button
                  onClick={() => setSelectedStar(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Reviews list ── */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-10 text-sm">
              {reviews.length === 0
                ? "No reviews yet. Be the first to review!"
                : "No reviews match this filter."}
            </p>
          ) : (
            filtered.map((review) => {
              const userName =
                typeof review.user === "object" ? review.user.name : "User";
              return (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3"
                >
                  <AvatarInitial name={userName} />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700 text-sm">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-400 italic mt-0.5">
                      "{review.comment}"
                    </p>
                    <div className="mt-1">
                      <StarRow rating={review.rating} />
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {reviews.length > 0 && (
            <p className="text-center text-xs text-slate-300 py-4">
              — End of Comments and Reviews for this hotel —
            </p>
          )}
        </div>
      </div>

      {/* ── Review Modal ── */}
      {submitError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-100 border border-red-300 text-red-700 text-sm px-5 py-2 rounded-xl shadow-lg z-50">
          {submitError}
        </div>
      )}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSubmitError(null);
        }}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
