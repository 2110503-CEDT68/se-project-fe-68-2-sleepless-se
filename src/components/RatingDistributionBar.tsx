"use client";

import Image from "next/image";
import { RatingDistributionBarProps } from "../../interface";

export default function RatingDistributionBar({
  starCounts,
  totalCount,
  avgRating,
  onStarClick,
  selectedStar,
  imageURL
}: RatingDistributionBarProps) {

  const stars = [5, 4, 3, 2, 1];
  const hasImage = !!imageURL;

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-8 p-4">

      {/* LEFT: Rating */}
      <div
        className={`relative flex flex-col items-center justify-center 
        w-[180px] aspect-square rounded-xl overflow-hidden shrink-0
        ${hasImage ? "" : "bg-transparent"}`}
      >

        {/* ✅ Background image (ONLY if exists) */}
        {hasImage && (
          <>
            <Image
              key={imageURL}
              src={imageURL}
              alt="hotel"
              fill
              sizes="160px"
              priority
              className="object-cover blur-[2px] scale-110 z-0"
            />
            {/* overlay only when image exists */}
            <div className="absolute inset-0 bg-black/50 z-10" />
          </>
        )}

        {/* ✅ Content */}
        <div
          className={`relative z-20 flex flex-col items-center
          ${hasImage ? "text-white" : "text-slate-800"}`}
        >
          <span className="text-[4.5rem] font-black leading-none">
            {avgRating ? Number(avgRating).toFixed(1) : "0.0"}
          </span>

          <div className="flex text-xl my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={
                  s <= Math.round(avgRating || 0)
                    ? "text-yellow-400"
                    : hasImage
                      ? "text-white/30"
                      : "text-slate-200"
                }
              >
                ★
              </span>
            ))}
          </div>

          <p
            className={`text-[10px] font-bold uppercase tracking-widest
            ${hasImage ? "text-white/80" : "text-slate-400"}`}
          >
            {totalCount.toLocaleString()} REVIEWS
          </p>
        </div>
      </div>

      {/* RIGHT: Bars */}
      <div className="flex-1 w-full flex flex-col gap-3">
        {stars.map((star) => {
          const count = starCounts[star] ?? 0;
          const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
          const isSelected = selectedStar === star;

          return (
            <div
              key={star}
              onClick={() => onStarClick?.(star)}
              className={`flex items-center gap-4 cursor-pointer transition-all ${
                selectedStar && !isSelected
                  ? "opacity-30 scale-95"
                  : "opacity-100 scale-100"
              }`}
            >
              <span
                className={`w-3 text-right font-bold text-sm ${
                  isSelected ? "text-yellow-600" : "text-slate-500"
                }`}
              >
                {star}
              </span>

              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSelected ? "bg-yellow-500" : "bg-yellow-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span
                className={`min-w-[40px] text-[11px] font-bold text-right ${
                  isSelected ? "text-yellow-600" : "text-slate-400"
                }`}
              >
                {Math.round(percentage)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}