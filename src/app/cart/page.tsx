"use client"
import React from 'react';
import BookingList from '@/components/BookingList';

export default function CartPage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-10 flex flex-col items-center">
            <h1 className="text-3xl font-extrabold text-sky-900 mb-8 text-center">Hotel Bookings</h1>
            <BookingList />
        </main>
    );
}
