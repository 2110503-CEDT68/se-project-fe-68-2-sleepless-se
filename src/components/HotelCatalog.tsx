"use client"
import React, { useState, useEffect } from 'react';
import HotelCard from './HotelCard';
import getHotels from '@/libs/getHotels';
import { Hotel } from '../../interface';

const hotelImageMap: Record<string, string> = {
  "Rayong Sand Beach": "/img/rayong_sand_beach.jpg",
  "Trat Station Hotel": "/img/trat_station.jpg",
  "Sukhothai Old Town Guest": "/img/sukhothai.jpg",
  "Lopburi Monkey Inn": "/img/monkey.jpg",
  "Songkhla Mermaid Hotel": "/img/songkhla.jpg",
  "Grand Bangkok Hotel": "/img/grandbangkok.jpg",
  "Pai Mist Boutique": "/img/pai.jpg",
  "Udon Thani Central Park": "/img/udon_thani.jpg",
  "Trat Islands Hotel": "/img/trat_island.jpg",
  "Nan Hidden Gem": "/img/nan_hidden.jpeg",
  "Sea View Resort": "/img/sea_view.jpg",
  "Krabi Cliff Resort": "/img/krabi.jpg",
  "Ayutthaya Heritage Hotel": "/img/ayutthaya.jpg",
  "Khao Yai Nature Lodge": "/img/khaoyai.jpg",
  "Samui Sunset Villa": "/img/samui.jpg",
  "Hua Hin Blue Lagoon": "/img/huahin.jpg",
  "Isan Charm Resort": "/img/isan.jpg",
  "River Kwai Bridge Hotel": "/img/riverkwai.jpg",
  "Phuket Paradise": "/img/phuket.jpg",
  "Mountain Inn": "/img/mountain_inn.jpg"
};


const getHotelImage = (hotelName: string) => {
  return hotelImageMap[hotelName] || "/img/sukhothai.jpg"; 
};

export default function HotelCatalog() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchHotelsData = async () => {
        try {
            const hotelList = await getHotels(); 
            setHotels(hotelList);
        } catch (error) {
            console.error("Error in component:", error);
        } finally {
            setLoading(false);
        }
      };

      fetchHotelsData();
    }, []);

    if (loading) {
      return <div className="text-center text-slate-500 mt-10">Loading amazing hotels for you... 🌊</div>;
    }

    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-extrabold text-sky-900 mb-8 text-center">
          Explore Our Top Hotels
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard 
              key={hotel._id} 
              hotelId={hotel._id}
              hotelName={hotel.hotel_name}
              address={hotel.address}
              telephone={hotel.telephone}
              imageUrl={getHotelImage(hotel.hotel_name)} 
            />
          ))}
        </div>
      </div>
    );
}