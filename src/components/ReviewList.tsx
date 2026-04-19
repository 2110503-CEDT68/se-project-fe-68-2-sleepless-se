import ReviewCard from "./ReviewCard";

interface Review {
  id: number;
  name: string;
  comment: string;
  rating: number;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
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
          name={review.name}
          comment={review.comment}
          rating={review.rating}
        />
      ))}
    </div>
  );
}
