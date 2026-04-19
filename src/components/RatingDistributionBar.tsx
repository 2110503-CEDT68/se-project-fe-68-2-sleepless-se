"use client";

import { RatingDistributionBarProps } from "../../interface";

export default function RatingDistributionBar({
  starCounts,
  totalCount,
  avgRating,
  onStarClick,
  selectedStar,
}: RatingDistributionBarProps) {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-8 p-4">
      {/* ฝั่งซ้าย: คะแนนรวม */}
      <div className="flex flex-col items-center justify-center min-w-[140px] border-r border-slate-100 pr-8">
        <span className="text-[4.5rem] font-black text-slate-800 leading-none">
          {avgRating ? Number(avgRating).toFixed(1) : "0.0"}
        </span>
        <div className="flex text-yellow-400 text-xl my-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={s <= Math.round(avgRating || 0) ? "text-yellow-400" : "text-slate-200"}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {totalCount.toLocaleString()} REVIEWS
        </p>
      </div>

      {/* ฝั่งขวา: แท่งกราฟ (Interactive) */}
      <div className="flex-1 w-full flex flex-col gap-3">
        {stars.map((star) => {
          const count = starCounts[star] ?? 0;
          const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
          const isSelected = selectedStar === star;

          return (
            <div
              key={star}
              onClick={() => onStarClick?.(star)}
              className={`flex items-center gap-4 group cursor-pointer transition-all ${
                selectedStar && !isSelected ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <span className={`w-3 text-right font-bold text-sm ${isSelected ? "text-yellow-600" : "text-slate-500"}`}>
                {star}
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/30">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isSelected ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" : "bg-yellow-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={`min-w-[40px] text-[11px] font-bold text-right ${isSelected ? "text-yellow-600" : "text-slate-400"}`}>
                {Math.round(percentage)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}