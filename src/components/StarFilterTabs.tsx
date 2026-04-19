'use client'

import type { StarFilterTabsProps } from '../../interface';

export default function StarFilterTabs({
  selectedStar,
  onSelectStar,
  starCounts,
}: StarFilterTabsProps) {
  const activeStars = [5, 4, 3, 2, 1].filter((s) => starCounts[s] > 0);

  return (
    <div className="flex flex-wrap gap-2">
      {activeStars.map((star) => {
        const isActive = selectedStar === star;
        return (
          <button
            key={star}
            onClick={() => onSelectStar(isActive ? null : star)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isActive
                ? 'bg-yellow-400 text-white border-yellow-400 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-yellow-300 hover:bg-yellow-50'
            }`}
          >
            <span className={isActive ? 'text-white' : 'text-yellow-400'}>
              {'★'.repeat(star)}
            </span>
            <span>{star}.0</span>
            <span className={isActive ? 'text-yellow-100' : 'text-slate-400'}>
              ({starCounts[star]})
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function filterReviewsByStar<T extends { rating: number }>(
  reviews: T[],
  selectedStar: number | null
): T[] {
  if (selectedStar === null) return reviews;
  return reviews.filter((r) => r.rating === selectedStar);
}

export function computeStarCounts<T extends { rating: number }>(
  reviews: T[]
): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating]++;
  });
  return counts;
}
