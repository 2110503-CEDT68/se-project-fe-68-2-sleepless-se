"use client"

import { useState,useEffect } from "react"
import styles from "./page.module.css"
import { use } from "react"; 
import { Rating } from "@mui/material";
import Link from "next/link";

import HotelEditPanel from "@/components/Hotel/HotelEditPanel";



export default function hotelPage({ params }: {params: Promise<{ id: string }>;}) {
    
    const { id } = use(params);
    const [hotelName,setHotel] = useState("Dummy Hotel");
    const [hotelDescription,setDescription] = useState("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ");
    const [hotelLocation,setLocation] = useState("dummy Location");
    const [hotelTelephone,setTelephone] = useState("+66xxxxxxxxxxx");
    const [hotelEmail, setEmail] = useState("Dummy Email");
    const [hotelPhotoURL, setPhotoURL] = useState("Photo");
    const [hotelTotalRating,setTotalRating] = useState(5);

    useEffect(()=>
    {}
    ,[]);


    return(
        <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 flex flex-col items-center ">
            <div className={styles.StyleWrapper}>
                <h1>{hotelName} ({id}) </h1>
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
                    <button>
                        Review
                    </button>
                </div>
            </div>
            
            <HotelEditPanel/>

        </main>
    )
};