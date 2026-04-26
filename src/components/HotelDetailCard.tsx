"use client";

import Link from "next/link";
import Image from "next/image";
import HotelEditModal from "./Hotel/HotelEditModal";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import getHotel from "@/libs/getHotel";
import { HotelUpdateData } from "../../interface";
import updateHotel from "@/libs/updateHotels";
import HotelEditPanel from "./Hotel/HotelEditPanel";

export default function HotelDetailCard({ hotelData, id, hasBooked, onReviewClick }: any) {
  const { data: session, status } = useSession();

  const [isEditOpen, setIsEdit] = useState(false);

  const [hotelName,setHotel] = useState("Dummy Hotel");
  const [hotelDescription,setDescription] = useState("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ");
  const [hotelLocation,setLocation] = useState("dummy Location");
  const [hotelDistrict,setDistrict] = useState("Dummy District");
  const [postalCode,setPostal] = useState("Dummy Postal");
  const [province,setProvince] = useState("DummyProvince");
  const [region, setRegion] = useState("Dummy region");
  const [hotelTelephone,setTelephone] = useState("+66xxxxxxxxxxx");
  const [hotelEmail, setEmail] = useState("Dummy Email");
  const [hotelPhotoURL, setPhotoURL] = useState("");

  useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const hotelData = await getHotel(id);

                console.log("BACKEND RETURNED THIS DATA:", hotelData);

                setHotel(hotelData.hotel_name || "Name not found.");
                setDescription(hotelData.description || "No description available.");
                setLocation(hotelData.address || hotelData.region || "Location not specified");
                setTelephone(hotelData.telephone || "No phone number provided.");
                setEmail(hotelData.email || "No email provided");
                setRegion(hotelData.region);
                setDistrict(hotelData.district);
                setPostal(hotelData.postalcode);
                setProvince(hotelData.province);
                setPhotoURL(hotelData? hotelData.imageURL:"");
                
            } catch (error) {
                console.error("Error loading hotel:", error);
            }
        };

        if (id) {
            fetchHotelData();
        }
    }, [id]);

  const handleEdit = async (updatedData: HotelUpdateData) => {
    if (!session?.user?.token) {
        alert("You must be logged in");
        return;
    }

    try {
        const result = await updateHotel(
        id,
        updatedData,
        session.user.token
        );

        console.log("Updated:", result);

        // update UI
        setHotel(updatedData.name);
        setDescription(updatedData.description);
        setLocation(updatedData.location);
        setTelephone(updatedData.telephone);
        setEmail(updatedData.email);
        setProvince(updatedData.province);
        setDistrict(updatedData.district);
        setPostal(updatedData.postalcode);
        setRegion(updatedData.region);

        setIsEdit(false); 

    } catch (err) {
        console.error("Update failed:", err);
    }
    };


  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center border border-slate-200">
      <div className="w-full md:w-72 aspect-[4/3] bg-[#E2E8F0] rounded-[1.5rem] overflow-hidden shrink-0 flex items-center justify-center relative">
        {hotelData.picture || hotelData.imageURL ? (
          <Image src={hotelData.picture || hotelData.imageURL} alt="hotel" className="w-full h-full object-cover" fill/>
        ) : (
          <span className="font-bold text-slate-400 text-xl">No Photo</span>
        )}
      </div>
      <div className="flex-1 w-full space-y-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{hotelData.hotel_name}</h1>
          <div className="flex gap-2 w-full md:w-auto flex-wrap">
            {hasBooked && (
              <button 
                onClick={onReviewClick}
                className="flex-1 bg-[#ef9322] hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
              >
                Review
              </button>
            )}
            <Link href={`/booking?hotel=${id}`} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-8 py-2.5 rounded-xl font-bold text-center transition-all shadow-sm">
              Book Now
            </Link>

          </div>
        </div>

        <div className="absolute bottom-0 right-0">
          {session && (
                    <>
                        {session.user?.role === "admin" || session.user?.role === "manager" && (
                            <button onClick={()=> setIsEdit(true)}
                                    className="flex-1 md:flex-none bg-blue-400 hover:bg-amber-500 text-blue-550 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                                Edit
                            </button>
                        )}
                    </>
                )}

            <HotelEditModal isOpen={isEditOpen}>
                { isEditOpen && (
                <HotelEditPanel
                    name={hotelData.hotel_name}
                    description={hotelData.description}
                    email={hotelData.email}
                    location={hotelData.address}
                    photoURL={hotelData.imageURL}
                    telephone={hotelData.telephone}
                    region={hotelData.region}
                    district={hotelData.District}
                    province={hotelData.province}
                    postalcode={hotelData.postalCode}
                    onSave={handleEdit}
                    onCancel={() => setIsEdit(false)}
                />
                )}


            </HotelEditModal>
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