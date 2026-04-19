import { Rating } from "@mui/material";

interface ReviewCardProps {
  name: string;
  comment: string;
  rating: number;
}

export default function ReviewCard({ name, comment, rating }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm flex-shrink-0">
        {name.charAt(0)}
      </div>

      {/* Content */}
      <div>
        <p className="font-semibold text-slate-800 text-sm">{name}</p>
        <p className="text-slate-500 text-sm italic">"{comment}"</p>
        <Rating value={rating} precision={0.5} readOnly size="small" />
      </div>
    </div>
  );
}
