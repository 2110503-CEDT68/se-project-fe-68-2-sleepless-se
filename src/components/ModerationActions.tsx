"use client";

import { useState } from "react";
// นำเข้า Interface เดิมของคุณ (คุณอาจจะต้องไปเพิ่มฟิลด์ reports ใน Interface ด้วย)
import type { ModerationActionsProps } from "../../interface";

// สร้าง Interface เสริมสำหรับรับค่า reports
interface ExtendedModerationProps extends ModerationActionsProps {
  reports?: { reason: string; user?: string }[];
  isReported?: boolean;
}

export default function ModerationActions({
  reviewId,
  currentStatus,
  token,
  onActionComplete,
  reports, // รับค่า reports ที่แถมมาด้วย
  isReported,
}: ExtendedModerationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Permanently delete this review?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://se-be-9w6y.onrender.com/api/v1/reviews/${reviewId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }
      onActionComplete(reviewId, "delete");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 w-full md:max-w-[250px]">
      
     
      {isReported && reports && reports.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2.5 w-full text-left">
          <div className="text-red-700 font-bold text-xs flex items-center gap-1 mb-1.5">
            <span></span> Reported Reasons:
          </div>
          <ul className="list-disc pl-4 text-xs text-red-600 space-y-1">
            {reports.map((report, index) => (
              <li key={index}>{report.reason}</li>
            ))}
          </ul>
        </div>
      )}

    
      {error && (
        <span className="text-xs text-red-500 text-right" role="alert">
          {error}
        </span>
      )}

      {/* ปุ่ม Delete เดิม */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-[100%] md:w-[70px] px-3 py-1.5 rounded-md text-xs font-semibold bg-red-400 hover:bg-red-500 text-white transition-colors disabled:opacity-50 w-20 text-center shadow-sm"
      >
        {loading ? "…" : "Delete"}
      </button>
    </div>
  );
}