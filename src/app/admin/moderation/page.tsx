"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ModerationActions from "@/components/ModerationActions";
import type { ReviewStatus } from "../../../../interface";

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
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
      {initial}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
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

export default function ModerationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }
    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/");
        return;
      }
      fetchAllReviews();
    }
  }, [status, session]);

  const fetchAllReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: get all hotels
      const hotelsRes = await fetch(
        "https://se-be-9w6y.onrender.com/api/v1/hotels",
      );
      if (!hotelsRes.ok) throw new Error("Failed to fetch hotels");
      const hotelsData = await hotelsRes.json();
      const hotels: any[] = hotelsData.data ?? [];

      // Step 2: fetch reviews for each hotel in parallel
      const results = await Promise.all(
        hotels.map(async (hotel: any) => {
          try {
            const res = await fetch(
              `https://se-be-9w6y.onrender.com/api/v1/hotels/${hotel._id}/reviews`,
              { cache: "no-store" },
            );
            if (!res.ok) return [];
            const data = await res.json();
            // Tag each review with hotel info
            return (data.data ?? []).map((r: any) => ({
              ...r,
              hotel: { _id: hotel._id, hotel_name: hotel.hotel_name },
            }));
          } catch {
            return [];
          }
        }),
      );

      // Step 3: flatten and sort by newest first
      const allReviews = results
        .flat()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      setReviews(allReviews);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActionComplete = (
    reviewId: string,
    action: "delete" | "hide" | "unhide" | "reject" | "approve",
  ) => {
    // Remove deleted review from list immediately
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  };

  const filtered = reviews.filter((r) => {
    if (!search) return true;
    const userName = typeof r.user === "object" ? r.user.name : "";
    const hotelName = typeof r.hotel === "object" ? r.hotel.hotel_name : "";
    return (
      userName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      hotelName.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (status === "loading" || loading) {
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
        <div className="pt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Review Moderation Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by user, hotel, or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Review list */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <p className="text-center text-slate-300 py-12 text-sm">
                No reviews here.
              </p>
            ) : (
              filtered.map((review) => {
                const userName =
                  typeof review.user === "object" ? review.user.name : "User";
                const hotelName =
                  typeof review.hotel === "object"
                    ? review.hotel.hotel_name
                    : "";

                return (
                  <div
                    key={review._id}
                    className="flex items-start gap-3 px-4 py-4"
                  >
                    <AvatarInitial name={userName} />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-700 text-sm">
                        {userName}
                      </p>
                      {hotelName && (
                        <p className="text-[11px] text-sky-600 mb-0.5">
                          {hotelName}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 italic truncate">
                        "{review.comment}"
                      </p>
                      <StarRow rating={review.rating} />
                    </div>

                    <ModerationActions
                      reviewId={review._id}
                      currentStatus={review.status ?? "active"}
                      token={(session?.user as any)?.token ?? ""}
                      onActionComplete={handleActionComplete}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* End label */}
        {filtered.length > 0 && (
          <p className="text-center text-slate-300 text-xs italic">
            — End of reviews —
          </p>
        )}
      </div>
    </div>
  );
}
