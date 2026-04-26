"use client";
import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import getHotels from "@/libs/getHotels";
import getReviews from "@/libs/getReviews";
import { Hotel } from "../../interface";
import FilterBar from "./FilterBar";

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
  "Mountain Inn": "/img/mountain_inn.jpg",
};

const getHotelImage = (hotelName: string) => {
  return hotelImageMap[hotelName] || "/img/sukhothai.jpg";
};

interface HotelRating {
  avgRating: number;
  reviewCount: number;
}

export default function HotelCatalog() {
  // set min and max for slider bar (to filter price)
  const [minPrice, setMin] = useState(0);
  const [maxPrice, setMax] = useState(10000);
  // select filter from dropdown
  const [changeProvince, setProvince] = useState("");
  const [changeDistrict, setDistrict] = useState("");
  const [changeRegion, setRegion] = useState("");

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [ratings, setRatings] = useState<Record<string, HotelRating>>({});
  const [loading, setLoading] = useState(true);

  const [selectedRating, setSelectedRating] = useState<number | string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const hotelList = await getHotels({
          minRating: selectedRating !== "" ? Number(selectedRating) : undefined
        });
        setHotels(hotelList);

        // Fetch all reviews in parallel
        const ratingMap: Record<string,HotelRating> = {};
        const reviewResults = await Promise.all(
          hotelList.map((hotel: Hotel) => getReviews(hotel._id)),
        );

        hotelList.forEach((hotel: Hotel, i: number) => {
          const res = reviewResults[i];
          ratingMap[hotel._id] = {
            avgRating: res?.avgRating ? parseFloat(res.avgRating) : 0,
            reviewCount: res?.data?.length ?? 0,
          };
        });
        setRatings(ratingMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-slate-500 mt-10">
        Loading amazing hotels for you... 🌊
      </div>
    );
  }

  const result = hotels.filter((hotel) => {
    return (
      (hotel.province === changeProvince || changeProvince === "") &&
      (hotel.district === changeDistrict || changeDistrict === "") &&
      (hotel.region === changeRegion || changeRegion === "") &&
      hotel.price >= minPrice &&
      hotel.price <= maxPrice
    );
  });

  return (
    <div className="flex flex-row gap-5 p-8 w-full">
      <FilterBar
        provinceFilter={(e) => setProvince(e)}
        districtFilter={(e) => setDistrict(e)}
        regionFilter={(e) => setRegion(e)}
        minPriceFilter={(e) => setMin(e)}
        maxPriceFilter={(e) => setMax(e)}
      />
      <div className="flex-1">
        <h2 className="text-3xl font-extrabold text-sky-900 mb-8 text-center">
          Explore Our Top Hotels
        </h2>

      {/* Stars Filter Button */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setSelectedRating("")}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedRating === null
                ? 'bg-slate-700 text-white' :
                'bg-white text-slate-600'
            }`}
          >
            All
          </button>

          {[5,4,3,2,1].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedRating === star
                  ? 'bg-yellow-400 text-white' : 
                  'bg-white text-slate-600'
              }`}
            >
              {'★'.repeat(star)}
            </button>
          ))}
        </div>

{loading ? (
        <div className="text-center text-slate-500 mt-10">Searching for perfect hotels... 🌊</div>
      ) : (
        <>
          {hotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {result.map((hotel) => (
                  <HotelCard
                    key={hotel._id}
                    hotelId={hotel._id}
                    hotelName={hotel.hotel_name}
                    address={hotel.address}
                    telephone={hotel.telephone}
                    imageUrl={getHotelImage(hotel.hotel_name)}
                    avgRating={ratings[hotel._id]?.avgRating ?? 0}
                    reviewCount={ratings[hotel._id]?.reviewCount ?? 0}
                  />
                ))}
              </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              No hotels found with this rating. Try another filter!
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
