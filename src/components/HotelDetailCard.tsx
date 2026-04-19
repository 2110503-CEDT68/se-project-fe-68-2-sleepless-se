"use client";

import Link from "next/link";

export default function HotelDetailCard({ hotelData, id, hasBooked, onReviewClick }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center border border-slate-100">
      <div className="w-full md:w-72 aspect-[4/3] bg-[#E2E8F0] rounded-[1.5rem] overflow-hidden shrink-0 flex items-center justify-center">
        {hotelData.picture || hotelData.image ? (
          <img src={hotelData.picture || hotelData.image} alt="hotel" className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-slate-400 text-xl">No Photo</span>
        )}
      </div>

      <div className="flex-1 w-full space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{hotelData.hotel_name}</h1>
          <div className="flex gap-2 w-full md:w-auto">
            {hasBooked && (
              <button 
                onClick={onReviewClick}
                className="flex-1 md:flex-none bg-amber-400 hover:bg-amber-500 text-amber-950 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
              >
                Review
              </button>
            )}
            <Link href={`/booking?hotel=${id}`} className="flex-1 md:flex-none bg-[#1E293B] hover:bg-black text-white px-8 py-2.5 rounded-xl font-bold text-center transition-all shadow-sm">
              Book Now
            </Link>
          </div>
        </div>
        
        <p className="text-slate-400 text-lg">{hotelData.description || "No description available for this hotel."}</p>
        
        <div className="pt-4 flex flex-wrap gap-6 text-slate-500 font-medium">
          <span className="flex items-center gap-2">
            <span className="text-rose-500 text-xl">📍</span> {hotelData.address || hotelData.province}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-rose-500 text-xl">📞</span> {hotelData.telephone}
          </span>
        </div>
      </div>
    </div>
  );
}