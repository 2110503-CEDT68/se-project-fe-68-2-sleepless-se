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

export default function hotelPage({ params }: { params: Promise<{ id: string }>;}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const { id } = use(params);
    const [hotelName,setHotel] = useState("Dummy Hotel");
    const [hotelDescription,setDescription] = useState("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ");
    const [hotelLocation,setLocation] = useState("dummy Location");
    const [hotelTelephone,setTelephone] = useState("+66xxxxxxxxxxx");
    const [hotelEmail, setEmail] = useState("Dummy Email");
    const [hotelPhotoURL, setPhotoURL] = useState("Photo");
    const [hotelTotalRating,setTotalRating] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const hotelData = await getHotel(id);

                console.log("BACKEND RETURNED THIS DATA:", hotelData);

                setHotel(hotelData.hotel_name || "Name not found.");
                setDescription(hotelData.description || "No description available.");
                setLocation(hotelData.address || hotelData.region || "Location not specified");
                setTelephone(hotelData.tel);
                setEmail(hotelData.email || "No email provided");
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
        } catch (error) {
            console.error("Failed to submit review", error);
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
                        <h2>📍 {hotelLocation}</h2>
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
                    {/*Conditionally displaying these two between user's role*/}
                    <button>
                        Edit
                    </button>
                    <button onClick={() => setIsModalOpen(true)}>
                        Review
                    </button>
                </div>
            </div>

        <HotelEditPanel
            name={hotelName}
            description={hotelDescription}
            email={hotelEmail}
            location={hotelLocation}
            photoURL={hotelPhotoURL}
            telephone={hotelTelephone}
            />

            <Link href={`/hotel/${id}/reviews`} className={styles.ButtonWrapper}>
                All reviews
            </Link>
        
        <ReviewModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleReviewSubmit} 
        />

        </main>
  )
};
