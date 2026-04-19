"use client";

import { StarFilterTabsProps } from "../../interface";

export default function StarFilterTabs({
  selectedStar,
  onSelectStar,
  starCounts,
}: StarFilterTabsProps) {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* ปุ่ม "ทั้งหมด" */}
      <button
        onClick={() => onSelectStar(null)}
        className={`px-6 py-2 rounded-md border transition-all font-medium ${
          selectedStar === null
            ? "border-orange-500 text-orange-600 bg-orange-50 shadow-sm"
            : "border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-gray-50"
        }`}
      >
        ทั้งหมด
      </button>

      {/* ปุ่มแยกตามดาว */}
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => onSelectStar(star)}
          className={`px-4 py-2 rounded-md border transition-all font-medium ${
            selectedStar === star
              ? "border-orange-500 text-orange-600 bg-orange-50 shadow-sm"
              : "border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-gray-50"
          }`}
        >
          {star} ดาว ({starCounts[star] || 0})
        </button>
      ))}
    </div>
  );
}