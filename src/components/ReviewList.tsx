import React, { useState } from "react";
import ReviewCard from "./ReviewCard";
import ReportModal from "./ReportModal"; // นำเข้า Modal ที่เราจะสร้าง

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
  // 1. สร้าง State ควบคุม Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  // 2. ฟังก์ชันสำหรับยิง API ไปยัง Backend ของคุณ
  const handleReportSubmit = async (reviewId: string, reason: string) => {
    try {
      const response = await fetch(`/api/v1/reviews/${reviewId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ส่ง Token ไปด้วย
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Reported successfully!");
        setIsModalOpen(false); // ปิด Modal
        if (onRefresh) onRefresh(); // รีเฟรชข้อมูลรีวิวใหม่
      } else {
        alert(data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error("Report Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
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