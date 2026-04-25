import ReviewCard from "./ReviewCard";

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
  token?: string;
  onRefresh?: () => void;
}

export default function ReviewList({
  reviews,
  currentUserId,
  currentUserRole,
  token,
  onRefresh,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-10">
        No reviews for this rating.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
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
          token={token}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
