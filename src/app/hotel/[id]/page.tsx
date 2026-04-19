"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { use } from "react";
import { Rating } from "@mui/material";
import Link from "next/link";

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import HotelEditPanel from "@/components/Hotel/HotelEditPanel";
import ReviewModal from "@/components/ReviewModal";
import addReview from "@/libs/addReview";
import getHotel from "@/libs/getHotel";
import updateHotel from "@/libs/updateHotels";
import HotelEditModal from "@/components/Hotel/HotelEditModal";

export default function hotelPage({ params }: { params: Promise<{ id: string }>;}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const { id } = use(params);
    const [hotelName,setHotel] = useState("Dummy Hotel");
    const [hotelDescription,setDescription] = useState("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ");
    const [hotelLocation,setLocation] = useState("dummy Location");
    const [hotelDistrict,setDistrict] = useState("Dummy District");
    const [postalCode,setPostal] = useState("Dummy Postal");
    const [province,setProvince] = useState("DummyProvince");
    const [region, setRegion] = useState("Dummy region");
    const [hotelTelephone,setTelephone] = useState("+66xxxxxxxxxxx");
    const [hotelEmail, setEmail] = useState("Dummy Email");
    const [hotelPhotoURL, setPhotoURL] = useState("Photo");
    const [hotelTotalRating,setTotalRating] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEdit] = useState(false);

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
                // setPhotoURL(hotelData.picture);
                
            } catch (error) {
                console.error("Error loading hotel:", error);
            }
        };

        if (id) {
            fetchHotelData();
        }
    }, [id]);

    const handleReviewSubmit = async (rating: number, comment: string) => {
        console.log("User submitted:", { rating, comment });
            
        if (!session || !session.user || !session.user.token) {
            alert("You must be logged in to leave a review.");
                return; 
        }

        try {
            await addReview(
                id, 
                rating, 
                comment,   
                session.user.token
            );
            
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Failed to submit review", error);
            const errorMessage = error?.message || "Failed to submit review. Please try again.";
            alert(`Error: ${errorMessage}`);
        }
   };

   type HotelUpdateData = {
    name: string;
    description: string;
    location: string;
    telephone: string;
    email: string;
    photoURL: string;
    province:string;
    region: string;
    postalcode: string;
    district: string;

    };

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


    return(
        <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 flex flex-col items-center ">
            <div className={styles.StyleWrapper}>
                <h1>{hotelName}</h1>
                <div className={styles.ContentWrapper}>
                    <div className={styles.ImageWrapper}>
                        {/*TODO :: add </Image> when the backend has been edited*/}
                        <strong>hotelPhotoURL</strong>
                    </div>
                    <div className={styles.InformationWrapper}>
                        <h2>📍 {hotelLocation} {hotelDistrict} {province} {region} {postalCode}</h2>
                        <h2>📞 {hotelTelephone}</h2>
                        <h2>✉️ {hotelEmail}</h2>
                        <p>{hotelDescription}</p>
                        <div className={styles.Rating}>
                            <Rating defaultValue={hotelTotalRating} precision={0.5} readOnly/><h2>{hotelTotalRating} out of 5 stars</h2>
                        </div>
                    </div>
                </div>
                <div className={styles.ButtonWrapper}>
                    <Link href={`/booking?hotel=${id}`}>
                            Book Now  
                    </Link>
                {/* Only display these options if a user is logged in (session exists) */}
                {session && (
                    <>
                        
                        {/* Example of Role-Based Rendering for the Edit button */}
                        {/* Replace 'admin' with whatever role designates a manager/admin in your app */}
                        {session.user?.role === "admin" && (
                            <button onClick={()=> setIsEdit(true)}>
                                Edit
                            </button>
                        )}

                        <button onClick={() => setIsModalOpen(true)}>
                            Review
                        </button>
                    </>
                )}
            </div>
            </div>

            <HotelEditModal isOpen={isEditOpen}>
                { isEditOpen && (
                <HotelEditPanel
                    name={hotelName}
                    description={hotelDescription}
                    email={hotelEmail}
                    location={hotelLocation}
                    photoURL={hotelPhotoURL}
                    telephone={hotelTelephone}
                    region={region}
                    district={hotelDistrict}
                    province={province}
                    postalcode={postalCode}
                    onSave={handleEdit}
                    onCancel={() => setIsEdit(false)}
                />
                )}


            </HotelEditModal>

            <Link href={`/hotel/${id}/reviews`} className={styles.ButtonWrapper}>
                All reviews
            </Link>
        {session && (
            <ReviewModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleReviewSubmit} 
            />
        )}
        

        </main>
  )
};
