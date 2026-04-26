import React, { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewId: string, reason: string) => void;
  reviewId: string | null;
}

export default function ReportModal({ isOpen, onClose, onSubmit, reviewId }: ReportModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen || !reviewId) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }
    onSubmit(reviewId, reason);
    setReason(""); // เคลียร์ช่องแชทหลังส่ง
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-1">Are you sure you wanted to report this review?</h2>
        <p className="text-gray-500 text-sm mb-4">The review will be sent to admin to take further action</p>

        <textarea
          className="w-full h-32 p-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D98E82] resize-none"
          placeholder="Add additional message for this report..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#D98E82] hover:bg-[#c47d72] text-white px-8 py-2 rounded-lg font-medium transition"
          >
            report
          </button>
        </div>
      </div>
    </div>
  );
}