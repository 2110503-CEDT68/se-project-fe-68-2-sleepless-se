"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-md">
                
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {booking.hotel?.hotel_name || "Unknown Hotel"}
                </h3>
                
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

              <div className="flex space-x-3 w-full md:w-auto">
                <Link href={`/booking/edit/${booking._id}`} className="w-full md:w-auto">
                  <button className="w-full bg-sky-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
                      Edit
                  </button>
                </Link>
                <button onClick={() => handleDelete(booking._id)} 
                  className="w-full md:w-auto bg-rose-500 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
                    Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
}