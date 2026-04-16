import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "@/libs/getUserProfile";
import BookingForm from '@/components/BookingForm';

export default async function Booking({ searchParams }: { searchParams: Promise<{ hotel?: string }> }) {
  const session = await getServerSession(authOptions);
  
  const { hotel } = await searchParams;
  const selectedHotelId = hotel || "";

  return (
    <main className="min-h-screen pt-20">
      <BookingForm initialHotelId={selectedHotelId} />
    </main>
  );
}