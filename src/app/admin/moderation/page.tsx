"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ModerationActions from "@/components/ModerationActions";
import type { ReviewStatus } from "../../../../interface";
import Link from "next/link";
import ProfileIcon from "@/components/Profile/ProfileIcon";

// 1. เพิ่มฟิลด์ isReported และ reports ลงใน Interface
interface ReviewItem {
  _id: string;
  hotel: { _id: string; hotel_name: string } | string;
  user: { _id: string; name: string; profileImageUrl?: string } | string;
  rating: number;
  comment: string;
  status?: ReviewStatus;
  createdAt: string;
  isReported?: boolean; // เพิ่มบรรทัดนี้
  reports?: { reason: string; user?: string }[]; // เพิ่มบรรทัดนี้
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
      //get hotels
      const hotelsRes = await fetch(
        "https://se-be-9w6y.onrender.com/api/v1/hotels",
      );
      if (!hotelsRes.ok) throw new Error("Failed to fetch hotels");
      const hotelsData = await hotelsRes.json();
      const hotels: any[] = hotelsData.data ?? [];

      //fetch reviews
      const results = await Promise.all(
        hotels.map(async (hotel: any) => {
          try {
            const res = await fetch(
              `https://se-be-9w6y.onrender.com/api/v1/hotels/${hotel._id}/reviews`,
              { cache: "no-store" },
            );
            if (!res.ok) return [];
            const data = await res.json();
            // 2. ส่งฟิลด์ reports และ isReported มาให้ครบ
            return (data.data ?? []).map((r: any) => ({
              ...r,
              hotel: { _id: hotel._id, hotel_name: hotel.hotel_name },
              isReported: r.isReported,
              reports: r.reports,
            }));
          } catch {
            return [];
          }
        }),
      );

      const allReviews = results
        .flat()
        .filter((r: any) => r.isReported === true)
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
    <div className="min-h-screen bg-slate-100 pt-28 pb-10 px-4 flex flex-col items-center">
      <div className="flex flex-col gap-4 mx-auto max-w-3xl">
        {/* Header */}
        <div className=" flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-[#0c4a6e]">
            Review Moderation Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} total
          </p>
        </div>

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
                console.log("prinitng out user");
                console.log(review.user);
                const userName =
                  typeof review.user === "object" ? review.user.name : "User";
                const profileURL =
                  typeof review.user === "object"
                    ? review.user.profileImageUrl
                    : "User";
                const hotelName =
                  typeof review.hotel === "object"
                    ? review.hotel.hotel_name
                    : "";
                const hotelId =
                  typeof review.hotel === "object" ? review.hotel._id : "";

                return (
                  <div
                    key={review._id}
                    className="flex items-start align-center gap-4 p-6 flex-col md:flex-row"
                  >
                    <div className="flex items-start gap-4  flex-col md:flex-row w-full">
                      <div className="flex flex-row gap-4 flex-1 w-full">
                        <ProfileIcon name={userName} color={profileURL} />

                        <div className="flex flex-col flex-1 min-w-0 w-full">
                          <div className="flex flex-col mb-2 rounded-[0.5rem] p-3 border border-slate-200 w-full">
                            <StarRow rating={review.rating} />
                            <p className="text-xs text-slate-400 italic break-words">
                              "{review.comment}"
                            </p>
                          </div>

                          <p className="text-slate-700 text-xs ml-2">
                            <strong>comment by :</strong> {userName}
                          </p>

                          {hotelName && (
                            <Link href={`/hotel/${hotelId}`}>
                              <p className="text-sky-600 mb-0.5 text-xs ml-2">
                                <strong>From :</strong> {hotelName}
                              </p>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    <ModerationActions
                      reviewId={review._id}
                      hotelId={hotelId}
                      currentStatus={review.status ?? "active"}
                      token={(session?.user as any)?.token ?? ""}
                      onActionComplete={handleActionComplete}
                      isReported={review.isReported}
                      reports={review.reports}
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
            — End of reported reviews —
          </p>
        )}
      </div>
    </div>
  );
}
