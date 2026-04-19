"use client";

import { useState } from "react";
import { Rating } from "@mui/material";
import Link from "next/link";
import ReviewList from "@/components/ReviewList";

const dummyReviews = [
  { id: 1, name: "Jake", comment: "The hotel is clean!", rating: 5 },
  { id: 2, name: "Jackson", comment: "The service is astonishing!", rating: 5 },
  { id: 3, name: "James", comment: "Amazing services.", rating: 4 },
  { id: 4, name: "Jennie", comment: "Nice environment.", rating: 5 },
  { id: 5, name: "Jeremy", comment: "I wouldn't visit again", rating: 1 },
  { id: 6, name: "John", comment: "Love the breakfast!", rating: 4 },
  { id: 7, name: "Julia", comment: "Very comfortable beds.", rating: 3 },
  { id: 8, name: "Jayce", comment: "it is alright", rating: 3.5 },
  { id: 9, name: "Jimmy", comment: "very bad one meh", rating: 2 },
];

export default function AllReviewsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const hotelName = "Dummy Hotel";

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredAndSorted = [...dummyReviews]
    .filter((r) => (filterRating === null ? true : r.rating === filterRating))
    .sort((a, b) =>
      sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating,
    );

  const availableRatings = [...new Set(dummyReviews.map((r) => r.rating))].sort(
    (a, b) => b - a,
  );

  return (
    <main className="min-h-screen bg-slate-100 pt-28 pb-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
              All reviews of
            </h1>
            <h1 className="text-2xl font-bold text-slate-800">{hotelName}</h1>
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="mt-1 px-3 py-2 rounded-lg bg-slate-400 text-white text-sm font-medium cursor-pointer focus:outline-none"
          >
            <option value="desc">rating ↓</option>
            <option value="asc">rating ↑</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              filterRating === null
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
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
                  ? "bg-yellow-400 text-white border-yellow-400"
                  : "bg-white text-slate-600 border-slate-300 hover:border-yellow-400"
              }`}
            >
              <Rating
                value={star}
                precision={0.5}
                readOnly
                size="small"
                max={Math.ceil(star)}
              />
              <span>{star} stars</span>
            </button>
          ))}
        </div>

        <ReviewList reviews={filteredAndSorted} />

        <div className="mt-6">
          <Link
            href={`/hotel/${id}`}
            className="text-slate-500 text-sm hover:text-slate-700 transition-colors"
          >
            ← Back to hotel
          </Link>
        </div>
      </div>
    </main>
  );
}
