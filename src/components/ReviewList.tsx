import React, { useState } from "react";
import ReviewCard from "./ReviewCard";
import ReportModal from "./ReportModal"; // นำเข้า Modal ที่เราจะสร้าง
import createReport from "@/libs/createReport";

interface Review {
  id: number;
  hotelId: string;
  userName: string;
  comment: string;
  rating: number;
  status?: string;
  authorId?: string;
}

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  currentUserRole?: string;
  currentUserHotelId?: string; // แนะนำให้เพิ่ม prop นี้เพื่อเอาไว้เช็คสิทธิ์ Manager กับ Hotel
  token?: string;
  onRefresh?: () => void;
}

export default function ReviewList({
  reviews,
  currentUserId,
  currentUserRole,
  currentUserHotelId,
  token,
  onRefresh,
}: ReviewListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const handleReportSubmit = async (reviewId: string, reason: string) => {
  if (!token) {
    alert("You must be logged in to report a review.");
    return;
  }

  try {
    await createReport(reviewId, reason, token);

    alert("Reported successfully!");
    setIsModalOpen(false); 
    if (onRefresh) onRefresh(); 
    
  } catch (error: any) {
    console.error("Report Error:", error);
    alert(error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
  }
};

  if (reviews.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-10">
        No reviews for this rating.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 relative">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          reviewId={String(review.id)}
          hotelId={review.hotelId}
          userName={review.userName}
          comment={review.comment}
          rating={review.rating}
          status={review.status}
          authorId={review.authorId}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          currentUserHotelId={currentUserHotelId} // ส่งไปเช็คใน ReviewCard
          token={token}
          onRefresh={onRefresh}
          // 3. ส่งฟังก์ชันเปิด Modal ไปให้ ReviewCard
          onOpenReport={() => {
            setSelectedReviewId(String(review.id));
            setIsModalOpen(true);
          }}
        />
      ))}

      {/* 4. วาง Component Modal ไว้ด้านล่างสุด */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReportSubmit}
        reviewId={selectedReviewId}
      />
    </div>
  );
}