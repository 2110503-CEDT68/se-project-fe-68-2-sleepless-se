'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Banner() {
  const covers= ['/img/find_your.jpg','/img/banner2.jpg','/img/banner3.jpg']
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => prevIndex + 1);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden"
    onClick={()=>setIndex((prevIndex) => prevIndex + 1)}>
      <Image
        src={covers[index%covers.length]}
        alt="Banner"
        fill
        className="object-cover"
        priority
      />
      {/*overlay*/}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] z-10"></div>

      <div className="relative z-20 text-center px-4">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-xl">
          Find Your Perfect Stay
        </h1>
        <p className="text-lg text-white/90 mt-4 max-w-xl drop-shadow-md">
          Discover the best hotels, resorts, and hidden gems across Thailand.
        </p>
      </div>
    </div>
  );
}