'use client'

import type { RatingDistributionBarProps } from '../../interface';

export default function RatingDistributionBar({
  starCounts,
  totalCount,
  avgRating,
}: RatingDistributionBarProps) {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="flex items-start gap-4">
      {/* Big average number */}
      <div className="flex flex-col items-center justify-center min-w-[64px]">
        <span className="text-5xl font-extrabold text-slate-800 leading-none">
          {avgRating !== null ? Number(avgRating).toFixed(1) : '–'}
        </span>
        <div className="flex text-yellow-400 text-base mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={
                avgRating && s <= Math.round(avgRating)
                  ? 'text-yellow-400'
                  : 'text-slate-200'
              }
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {totalCount} review{totalCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-1.5 py-1">
        {stars.map((star) => {
          const count = starCounts[star] ?? 0;
          const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-right text-slate-500 font-medium">{star}</span>
              <span className="text-yellow-400 text-sm">★</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                  data-testid={`bar-star-${star}`}
                />
              </div>
              <span className="w-4 text-slate-400">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
