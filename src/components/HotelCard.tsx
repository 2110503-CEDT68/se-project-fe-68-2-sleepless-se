import Image from 'next/image';
import Link from 'next/link';

interface HotelCardProps {
    hotelId: string;
    hotelName: string;
    address: string;
    telephone: string;
    imageUrl: string;
}

export default function HotelCard({ hotelId, hotelName, address, telephone, imageUrl }: HotelCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="w-full h-[200px] relative bg-slate-200">
        <Image 
          src={imageUrl}
          alt={hotelName}
          fill={true}
          className="object-cover"
        />
      </div>
            
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-sky-900 mb-2 truncate">{hotelName}</h3>
          <p className="text-sm text-slate-500 mb-1 line-clamp-2">📍 {address}</p>
          <p className="text-sm text-slate-500 mb-4">📞 {telephone}</p>
                
          <div className="mt-auto">
          <Link href={`/hotel/${hotelId}`}>
            <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-xl font-medium transition-colors">
              View & Book Now
            </button>
          </Link>
          </div>
      </div>
    </div>
    );
}