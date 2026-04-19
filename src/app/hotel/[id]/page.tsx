"use client";

<<<<<<< Updated upstream
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { use } from "react";
import { Rating } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from 'next/navigation';
=======
import { useState, useEffect, use } from "react";
>>>>>>> Stashed changes
import { useSession } from 'next-auth/react';

import HotelDetailCard from "@/components/HotelDetailCard"; // Component ใหม่
import StarFilterTabs from "@/components/StarFilterTabs";
import ReviewModal from "@/components/ReviewModal";
import ReviewCard from "@/components/ReviewCard";
import RatingDistributionBar from "@/components/RatingDistributionBar";
import addReview from "@/libs/addReview";
import getHotel from "@/libs/getHotel";
<<<<<<< Updated upstream
import updateHotel from "@/libs/updateHotels";
import HotelEditModal from "@/components/Hotel/HotelEditModal";
=======
import getReviews from "@/libs/getReviews";
import getBookings from "@/libs/getBookings";
>>>>>>> Stashed changes

export default function HotelPage({ params }: { params: Promise<{ id: string }> }) {
    const { data: session } = useSession();
    const { id } = use(params);
<<<<<<< Updated upstream
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
    const [hotelTotalRating,setTotalRating] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEdit] = useState(false);
=======
    
    const [isLoading, setIsLoading] = useState(true);
    const [hotelData, setHotelData] = useState<any>(null);
    const [reviewsData, setReviewsData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [hasBooked, setHasBooked] = useState(false);
>>>>>>> Stashed changes

    const [reviewStats, setReviewStats] = useState({
        totalCount: 0,
        avgRating: 0,
        starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
    });

    const fetchHotelAndReviews = async () => {
        try {
            const hData = await getHotel(id);
            setHotelData(hData);

<<<<<<< Updated upstream
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
=======
            const rData = await getReviews(id);
            if (rData && rData.data) {
                const reviews = rData.data;
                setReviewsData(reviews);

                const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                let totalRating = 0;
                reviews.forEach((r: any) => {
                    if (r.rating >= 1 && r.rating <= 5) {
                        counts[r.rating]++;
                        totalRating += r.rating;
                    }
                });
                setReviewStats({
                    totalCount: reviews.length,
                    avgRating: reviews.length > 0 ? totalRating / reviews.length : 0,
                    starCounts: counts
                });
>>>>>>> Stashed changes
            }
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    const checkUserBooking = async () => {
        if (!session?.user?.token) return;
        try {
            const bookingsRes = await getBookings(session.user.token);
            const bookings: any[] = bookingsRes?.data ?? [];
            const booked = bookings.some((b: any) => (b.hotel?._id || b.hotel) === id);
            setHasBooked(booked);
        } catch { setHasBooked(false); }
    };

    useEffect(() => { if (id) fetchHotelAndReviews(); }, [id]);
    useEffect(() => { if (session?.user?.token && id) checkUserBooking(); }, [session, id]);

    useEffect(() => {
    console.log("PHOTO URL UPDATED:", hotelPhotoURL);
    }, [hotelPhotoURL]);

    const handleReviewSubmit = async (rating: number, comment: string) => {
        if (!session?.user?.token) return;
        try {
            await addReview(id, rating, comment, session.user.token);
            setIsModalOpen(false);
<<<<<<< Updated upstream
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
                        <Image alt="hotelImage" src={hotelPhotoURL} fill style={{ objectFit: "cover" }}></Image>
                        {/*TODO :: add </Image> when the backend has been edited*/}
                        
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
        

=======
            fetchHotelAndReviews();
        } catch (error: any) { alert(error.message || "Failed to submit review."); }
    };

    const filteredReviews = selectedStar 
        ? reviewsData.filter(r => r.rating === selectedStar) 
        : reviewsData;

    if (isLoading) return <div className="pt-32 text-center font-bold text-slate-400 animate-pulse">Loading...</div>;
    if (!hotelData) return null;

    return (
        <main className="min-h-screen bg-[#EEF2F6] pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* 1. ใช้ Component HotelDetailCard ที่แยกมา */}
                <HotelDetailCard 
                    hotelData={hotelData} 
                    id={id} 
                    hasBooked={hasBooked} 
                    onReviewClick={() => setIsModalOpen(true)} 
                />

                {/* 2. Rating & Reviews Section */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-800 mb-8">คะแนนรีวิวจากผู้เข้าพัก</h2>
                    
                    {reviewStats.totalCount > 0 ? (
                        <>
                            <div className="mb-10 pb-8 border-b border-slate-50">
                                <RatingDistributionBar 
                                    starCounts={reviewStats.starCounts}
                                    totalCount={reviewStats.totalCount}
                                    avgRating={reviewStats.avgRating}
                                />
                            </div>

                            {/* ส่วน Filter Tabs ที่แยกเป็น Component */}
                            <StarFilterTabs 
                                selectedStar={selectedStar}
                                onSelectStar={setSelectedStar}
                                starCounts={reviewStats.starCounts}
                            />

                            <div className="space-y-4 mt-10">
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((review, idx) => (
                                        <ReviewCard 
                                            key={review._id || idx} 
                                            hotelId={id}
                                            reviewId={review._id}
                                            userName={typeof review.user === 'object' ? review.user?.name : 'Anonymous'}
                                            comment={review.comment}
                                            rating={review.rating}
                                            status={review.status}
                                            authorId={typeof review.user === 'object' ? review.user?._id : review.user}
                                            currentUserId={(session?.user as any)?.id}
                                            currentUserRole={(session?.user as any)?.role}
                                            token={session?.user?.token}
                                            onRefresh={fetchHotelAndReviews}
                                        />
                                    ))
                                ) : (
                                    <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                                        ยังไม่มีรีวิวสำหรับคะแนนชุดนี้
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl">
                            <div className="text-6xl mb-4 opacity-20">💬</div>
                            <h3 className="text-xl font-bold text-slate-400">ยังไม่มีรีวิวสำหรับโรงแรมนี้</h3>
                        </div>
                    )}
                </div>
            </div>

            {session && (
                <ReviewModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleReviewSubmit} 
                />
            )}
>>>>>>> Stashed changes
        </main>
    );
}