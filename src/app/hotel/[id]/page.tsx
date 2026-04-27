"use client";

import { useState, useEffect, use } from "react";
import { useSession } from 'next-auth/react';

import HotelDetailCard from "@/components/HotelDetailCard"; // Component ใหม่
import StarFilterTabs from "@/components/StarFilterTabs";
import ReviewModal from "@/components/ReviewModal";
import ReviewCard from "@/components/ReviewCard";
import RatingDistributionBar from "@/components/RatingDistributionBar";
import addReview from "@/libs/addReview";
import getHotel from "@/libs/getHotel";
import getReviews from "@/libs/getReviews";
import getBookings from "@/libs/getBookings";
import Link from "next/link";

export default function HotelPage({ params }: { params: Promise<{ id: string }> }) {
    const { data: session } = useSession();
    const { id } = use(params);
    
    const [isLoading, setIsLoading] = useState(true);
    const [hotelData, setHotelData] = useState<any>(null);
    const [reviewsData, setReviewsData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [hasBooked, setHasBooked] = useState(false);


    const [reviewStats, setReviewStats] = useState({
        totalCount: 0,
        avgRating: 0,
        starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
    });

    const fetchHotelAndReviews = async () => {
        try {
            const hData = await getHotel(id);
            setHotelData(hData);

            const rData = await getReviews(id);
            if (rData && rData.data) {
                const reviews = rData.data;
                const sortedReviews = reviews.sort(
                    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                const displayReviews = sortedReviews.slice(0, 3);
                setReviewsData(displayReviews);


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

    const handleReviewSubmit = async (rating: number, comment: string) => {
        if (!session?.user?.token) return;
        try {
            await addReview(id, rating, comment, session.user.token);
            setIsModalOpen(false);
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
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200">
    
                {/* Header Container: Flexbox handles the positioning */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-800">Reivews from visitors</h2>
                    
                </div>
                    
                    {reviewStats.totalCount > 0 ? (
                        <>
                            <div className="mb-5 pb-8 border-b border-slate-50">
                                <RatingDistributionBar 
                                    starCounts={reviewStats.starCounts}
                                    totalCount={reviewStats.totalCount}
                                    avgRating={reviewStats.avgRating}
                                />
                            </div>

                            <div className="flex justify-between items-center mb-8">                           
                                <h2 className="text-2xl font-black text-slate-800 border-b border-slate-50">Recent Reviews</h2>
                                <Link 
                                    href={`/hotel/${id}/reviews`} 
                                    className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-4"
                                >
                                    See All Reviews →
                                </Link>
                            </div>

                            <div className="space-y-4 mt-10">
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((review, idx) => (
                                        <ReviewCard 
                                            key={review._id || idx} 
                                            hotelId={id}
                                            reviewId={review._id}
                                            userName={typeof review.user === 'object' ? review.user?.name : 'Anonymous'}
                                            profileImageUrl={review.user?.profileImageUrl}
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
                            <h3 className="text-xl font-bold text-slate-400">There're no reviews for this hotel... yet</h3>
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
        </main>
    );
}