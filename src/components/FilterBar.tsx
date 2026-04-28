"use client";
import { use, useEffect, useState } from "react";
import DropDownFilter from "./DropDownFilter";
import getHotels from "@/libs/getHotels";
import { Hotel } from "../../interface";
import { ChevronDown } from "lucide-react";

export default function FilterBar({
  provinceFilter,
  districtFilter,
  regionFilter,
  minPriceFilter,
  maxPriceFilter,
}: {
  provinceFilter: (province: string) => void;
  districtFilter: (district: string) => void;
  regionFilter: (region: string) => void;
  minPriceFilter: (minPrice: number) => void;
  maxPriceFilter: (maxPrice: number) => void;
}) {
  // ดึงข้อมูลจาก back-end
  const [hotels, setHotels] = useState<Hotel[]>([]);
  // set min and max for slider bar (to filter price)
  const [minPrice, setMin] = useState(0);
  const [maxPrice, setMax] = useState(10000);
  // select filter from dropdown
  const [changeProvince, setProvince] = useState("select");
  const [changeDistrict, setDistrict] = useState("select");
  const [changeRegion, setRegion] = useState("select");

  const [openBy, setOpenBy] = useState("");
  const [isOpen, setOpen] = useState(false);

  // handle change
  const handleProvinceChange = (province: string) => {
    provinceFilter(province);
    setProvince(province);
  };
  const handleDistrictChange = (district: string) => {
    districtFilter(district);
    setDistrict(district);
  };
  const handleRegionChange = (region: string) => {
    regionFilter(region);
    setRegion(region);
  };
  const handleOnOpen = (openBy: string) => {
    setOpenBy(openBy);
  };

  useEffect(() => {
    const fetchHotelsData = async () => {
      try {
        const data: Hotel[] = await getHotels();
        setHotels(data);
        const max = Math.max(...data.map((hotel) => hotel.price));
        setMax(max);
      } catch (err) {
        console.log("Error : ", err);
      }
    };

    fetchHotelsData();
  }, []);

  const allPrices = hotels.map((hotel) => hotel.price);
  const maxFromData = Math.max(...allPrices);
  const result = hotels.filter((hotel) => {
    return (
      (hotel.province === changeProvince || changeProvince === "select") &&
      (hotel.district === changeDistrict || changeDistrict === "select") &&
      (hotel.region === changeRegion || changeRegion === "select")
    );
  });
  return (
    <div className="sticky top-[12%] self-start font-medium text-lg text-gray-700 flex flex-col gap-2 bg-white shadow-sm md:w-1/6 min-w-[200px] w-full p-5 m-2 rounded-lg z-10 relative border border-slate-200 ">
      {/* header */}
      <div className="flex flex-row relative">
        <div className="font-bold text-2xl text-blue-900">Filter</div>
        <div className="absolute right-2 top-1 cursor-pointer transition-all duration-300 ease-in-out" onClick={()=>setOpen(!isOpen)}
          style={{transform: isOpen? "rotateZ(180deg)":""}}
          ><ChevronDown /></div>
      </div>
      
      <div className={`
        font-medium text-lg text-gray-700 flex flex-col gap-2 w-full 
        overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"}
      `}>
      {/* เส้นคั่น */}
      <hr className="border-gray-200 my-2" />

      {/* filter items */}

      <DropDownFilter
        FilterBy="Province"
        onOptionSelect={handleProvinceChange}
        ObjectList={result.map((hotel) => hotel.province)}
        value={changeProvince}
        openBy={handleOnOpen}
        isMulti={openBy === "Province"}
      />
      <DropDownFilter
        FilterBy="District"
        onOptionSelect={handleDistrictChange}
        ObjectList={result.map((hotel) => hotel.district)}
        value={changeDistrict}
        openBy={handleOnOpen}
        isMulti={openBy === "District"}
      />
      <DropDownFilter
        FilterBy="Region"
        onOptionSelect={handleRegionChange}
        ObjectList={result.map((hotel) => hotel.region)}
        value={changeRegion}
        openBy={handleOnOpen}
        isMulti={openBy === "Region"}
      />

      {/* filter by price */}
      <div>Price Range</div>
      <div className="relative h-5">
        {/* ราง */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-gray-200 rounded-full"></div>
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 bg-blue-500/50 rounded-full"
          style={{
            left: `${(minPrice / maxFromData) * 100}%`,
            right: `${100 - (maxPrice / maxFromData) * 100}%`,
          }}
        ></div>

        {/* หัวปุ่ม min */}
        <input
          className="absolute w-full bg-transparent pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-200 [&::-webkit-slider-thumb]:cursor-pointer"
          type="range"
          min={0}
          max={maxFromData}
          value={minPrice}
          onChange={(e) => {
            Number(e.target.value) <= maxPrice &&
              setMin(Number(e.target.value));
            Number(e.target.value) <= maxPrice &&
              minPriceFilter(Number(e.target.value));
          }}
        />
        {/* หัวปุ่ม max */}
        <input
          className="absolute w-full bg-transparent pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-200 [&::-webkit-slider-thumb]:cursor-pointer"
          type="range"
          min={0}
          max={maxFromData}
          value={maxPrice}
          onChange={(e) => {
            minPrice <= Number(e.target.value) &&
              setMax(Number(e.target.value));
            minPrice <= Number(e.target.value) &&
              maxPriceFilter(Number(e.target.value));
          }}
        />
      </div>
      {/* min / max box */}
      <div className="flex flex-row justify-between items-center gap-2">
        <div>
          <div className="text-sm">From</div>
          <div className="bg-gray-100 rounded-lg p-2 w-full">
            <input
              type="number"
              className="bg-transparent w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none"
              min={0}
              max={maxFromData}
              value={minPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 && val <= maxFromData && val <= maxPrice) {
                  setMin(val);
                  minPriceFilter(val);
                }
              }}
            />
          </div>
        </div>

        <div>
          <div className="text-sm">To</div>
          <div className="bg-gray-100 rounded-lg p-2 w-full">
            <input
              type="number"
              className="bg-transparent w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none"
              min={0}
              max={maxFromData}
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMax(val); 
              }}
              onBlur={() => {
                if (maxPrice < minPrice) {
                  setMax(minPrice);
                  maxPriceFilter(minPrice);
                } else if (maxPrice > maxFromData) {
                  setMax(maxFromData);
                  maxPriceFilter(maxFromData);
                } else {
                  maxPriceFilter(maxPrice);
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* button filter */}
      <div className="flex flex-row justify-end text-white font-bold my-5">
        <button
          className=" bg-red-400 px-2 py-1 rounded-lg w-32 hover:bg-red-600"
          onClick={() => {
            provinceFilter("");
            districtFilter("");
            regionFilter("");
            minPriceFilter(0);
            maxPriceFilter(maxFromData);

            setProvince("select");
            setDistrict("select");
            setRegion("select");
            setMin(0);
            setMax(maxFromData);
          }}
        >
          Clear Filter
        </button>
      </div>
    </div>
    </div>
  );
}
