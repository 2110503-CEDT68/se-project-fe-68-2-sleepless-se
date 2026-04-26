"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import getBookings from '@/libs/getBookings';
import deleteBooking from '@/libs/deleteBooking';

export default function BookingList() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/api/auth/signin');
        } else if (session?.user?.token) {
            fetchData();
        }
    }, [session, status]);

    const fetchData = async () => {
        try {
            const token = (session?.user as any)?.token; 
            const data = await getBookings(token);
            console.log(data);
            setBookings(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); 
        }
    };

   
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        
        try {
            const token = (session?.user as any)?.token;
            await deleteBooking(id, token);
            alert("Booking Cancelled");
            fetchData(); 
        } catch (error) {
            console.error(error);
            alert("Error cancelling booking");
        }
    };

    if (loading) return <div className="text-slate-600 mt-10 text-lg text-center">Loading your bookings...</div>;
    
    if (bookings.length === 0) return <div className="text-slate-600 mt-10 text-lg text-center">No bookings found. Let's book a hotel!</div>;

    return (
      <div className="w-full max-w-4xl space-y-4 mx-auto">
        {bookings.map((booking: any) => {
          const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-GB');
          const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-GB');

          return (
           <div
                key={booking._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 hover:shadow-md transition md:flex-row"
              >

              <div className="flex flex-row gap-4 flex-1">

              <div className="relative w-32 h-24 max-h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200">
                  {booking.hotel?.imageURL ? (
                    <Image
                      src={booking.hotel.imageURL}
                      alt="hotel"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

              <div className="flex-1">
                <Link href={`/hotel/${booking.hotel?.id}`}>
                  <h3 className="text-xl font-bold text-[#0369a1]">
                    {booking.hotel?.hotel_name || "Unknown Hotel"}
                  </h3>
                </Link>

                {booking.user?.name && (
                  <div className="mt-2 p-2.5 bg-sky-50 border border-sky-100 rounded-lg inline-block">
                    <p className="text-sm font-semibold text-sky-700">
                      👤 Booked by: {booking.user.name}
                    </p>
                    {booking.user?.email && (
                      <p className="text-xs text-sky-600 mt-1">
                        ✉️ Email: {booking.user.email}
                      </p>
                    )}
                  </div>
                )}

                <div className="text-slate-500 text-sm mt-3 space-y-1">
                  <p><span className="font-semibold text-slate-700">Check-in:</span> {checkIn}</p>
                  <p><span className="font-semibold text-slate-700">Check-out:</span> {checkOut}</p>
                </div>
              </div>

              </div>

              <div className="flex flex-col gap-2 w-full md:max-w-[150px]">
                <Link href={`/booking/edit/${booking._id}`}>
                  <button className="w-full bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(booking._id)}
                  className="w-full bg-rose-500 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>

            </div>
          );
        })}
      </div>
    );
}