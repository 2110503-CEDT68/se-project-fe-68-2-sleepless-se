"use client"
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import getBooking from '@/libs/getBooking';
import updateBooking from '@/libs/updateBooking';

export default function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [bookDate, setBookDate] = useState("");
  const [nights, setNights] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pricePerNight, setPricePerNight] = useState(0);
  const [hotelName, setHotelName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/api/auth/signin');
      return;
    }
    if (session?.user?.token) fetchBookingData();
  }, [session, status]);

  const fetchBookingData = async () => {
    try {
      const token = (session?.user as any)?.token;
      const { data: booking } = await getBooking(bookingId, token);
      
      const checkIn  = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const diffDays = Math.ceil(Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      setPricePerNight(booking.hotel?.price || 0);
      setHotelName(booking.hotel?.hotel_name || "");

      setBookDate(checkIn.toISOString().split('T')[0]);
      setNights(diffDays);
      setLoading(false);

    } catch (error) {
      console.error(error);
      alert("Error loading booking data");
    }
  };

  const handleUpdate = async () => {
    if (nights > 3 || nights < 1) {
      alert("Maximum 3 nights allowed per booking.");
      return;
    }
    
    setSaving(true);
    try {
      const checkIn  = new Date(bookDate);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + nights);

      const token = (session?.user as any)?.token;
      await updateBooking(
        bookingId, 
        checkIn.toISOString(), 
        checkOut.toISOString(),
        totalPrice, 
        token
      );

      router.push('/cart');
      router.refresh();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"/>
          <p className="text-slate-500 text-sm">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // ── Computed preview ───────────────────────────────────
  const checkOutDate = bookDate
    ? new Date(new Date(bookDate).setDate(new Date(bookDate).getDate() + nights))
        .toISOString().split('T')[0]
    : null;

  const totalPrice = pricePerNight * nights;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 pt-28 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Modify Reservation</p>
          <h1 className="text-4xl font-extrabold text-slate-800">Edit Booking</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Colored top bar */}
          <div className="h-2 bg-gradient-to-r from-sky-400 to-indigo-400"/>

          <div className="p-8 space-y-6">

            {/* Check-in Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600">
                Check-in Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={bookDate}
                onChange={(e) => setBookDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
              />
            </div>

            {/* Number of Nights */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600">
                Number of Nights <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNights(Math.max(1, nights - 1))}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xl transition active:scale-95 flex items-center justify-center"
                >−</button>
                <div className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold text-xl">
                  {nights}
                </div>
                <button
                  type="button"
                  onClick={() => setNights(Math.min(3, nights + 1))}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xl transition active:scale-95 flex items-center justify-center"
                >+</button>
              </div>
              <p className="text-xs text-slate-400">Maximum 3 nights per booking</p>
            </div>

            {/* Summary preview */}
            {bookDate && checkOutDate && (
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 space-y-2 text-sm">
                <p className="text-sky-700 font-semibold">Booking Summary</p>
                
                {hotelName && (
                  <div className="flex justify-between text-sky-800 mb-2 pb-2 border-b border-sky-100">
                    <span className="font-bold">{hotelName}</span>
                  </div>
                )}

                <div className="flex justify-between text-sky-600">
                  <span>Check-in</span>
                  <span className="font-medium">{bookDate}</span>
                </div>
                <div className="flex justify-between text-sky-600">
                  <span>Check-out</span>
                  <span className="font-medium">{checkOutDate}</span>
                </div>
                <div className="flex justify-between text-sky-600">
                  <span>Duration</span>
                  <span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
                
                {/* Total Price Display */}
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-sky-200">
                  <span className="text-slate-600 font-medium">
                    Total Price {pricePerNight > 0 && <span className="text-slate-400 font-normal">(${pricePerNight} × {nights})</span>}
                  </span>
                  <span className="text-xl font-bold text-sky-700">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md text-sm tracking-wide active:scale-95"
              >
                {saving ? 'Saving...' : 'CONFIRM UPDATE'}
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="w-full bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-medium py-3 rounded-xl transition border border-slate-200 text-sm"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>

        {/* Back hint */}
        <p className="text-center text-xs text-slate-400 mt-5">
          Changes will be saved immediately after confirmation.
        </p>
      </div>
    </div>
  );
}