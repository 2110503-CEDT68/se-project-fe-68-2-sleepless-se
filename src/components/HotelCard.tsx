import Image from 'next/image';
import Link from 'next/link';
import { Rating } from '@mui/material';

interface HotelCardProps {
  hotelId: string;
  hotelName: string;
  address: string;
  telephone: string;
  imageUrl: string;
  avgRating?: number;
  reviewCount?: number;
}

export default function HotelCard({
  hotelId,
  hotelName,
  address,
  telephone,
  imageUrl,
  avgRating = 0,
  reviewCount = 0,
}: HotelCardProps) {
  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
      {/* Image */}
      <div className="w-full h-[220px] relative bg-slate-100 overflow-hidden">
        <Image
          src={imageUrl || "/img/sukhothai.jpg"}
          alt={hotelName}
          fill={true}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-7 flex flex-col flex-grow space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-2 min-h-[32px]">
          {reviewCount > 0 ? (
            <div className="flex items-center gap-2">
              <Rating
                value={avgRating}
                readOnly
                size="small"
                precision={0.5}
                sx={{ color: '#F59E0B' }}
              />
              <span className="text-sm font-bold text-slate-700">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-medium">({reviewCount})</span>
            </div>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              No reviews yet
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-[#1E293B] truncate leading-tight">{hotelName}</h3>
          <div className="space-y-1.5 pt-1">
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <span className="text-rose-500 shrink-0">📍</span>
              <span className="truncate">{address}</span>
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <span className="text-rose-500 shrink-0">📞</span>
              <span>{telephone}</span>
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="mt-auto pt-4">
          <Link href={`/hotel/${hotelId}`}>
            <button className="w-full bg-[#1E293B] hover:bg-black text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-[0.98]">
              View & Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}