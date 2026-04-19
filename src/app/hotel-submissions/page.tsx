"use client";
import { Rating } from "@mui/material";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import getHotelSubmissions from "@/libs/getHotelSubmissions";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface Manager {
  name: string;
  email: string;
}

interface HotelSubmission {
  _id: string;
  hotelId: string;
  status: string;
  manager?: Manager;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
        {children}<br/>
        <div className="flex space-x-3 w-full md:w-auto ml-auto">
        <button onClick={onClose} className="w-full md:w-auto bg-rose-500 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
            Reject</button>
        <button onClick={onClose} className="w-full md:w-auto bg-sky-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
            Approve</button>
        </div>
      </div>
    </div>
  );
};

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const contentStyles: React.CSSProperties = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  minWidth: '300px',
};



export default function HotelSubmissionPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [submissions, setSubmissions] = useState<HotelSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchSubmissions = async () => {
        setLoading(true);
        try {
            // Retrieve the token from wherever you store it (localStorage, Context, Redux, etc.)
            const token = localStorage.getItem('token'); 
            
            // Call the lib function
            const result = await getHotelSubmissions(token);
            
            if (result.success) {
            setSubmissions(result.data);
            }
        } catch (err) {
            setError(error);
        } finally {
            setLoading(false);
        }
        };

        fetchSubmissions();
    },[]);

    if (loading) return <div>Loading submissions...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        
        <main className="min-h-screen bg-slate-100 pt-28 pb-10 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                    Hotel edit submissions
                    </h1>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div
                    className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
                    <div>
                        <p className="text-xl font-bold text-slate-800">
                        Hotel Name
                        </p>
                        <p className="text-slate-500 text-sm italic">
                        Details
                        </p>
                    </div>

                <div className="flex space-x-3 w-full md:w-auto ml-auto">
                    <Link href={`/hotel-submissions`} className="w-full md:w-auto">
                        <button onClick={() => setIsModalOpen(true)} className="w-full bg-sky-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
                        View
                        </button>
                    </Link>

                    <Overlay 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}>
                    <div className="flex flex-col gap-3">
                        <p>
                            //image//
                        </p>
                        <p className="text-xl font-bold text-slate-800">
                            Hotel Name
                        </p>
                        <p className="font-semibold text-slate-700">
                            📍 Location
                        </p>
                        <p className="font-semibold text-slate-700">
                            📞 0123456789
                        </p>
                        <p className="font-semibold text-slate-700">
                            ✉️ email
                        </p>
                        <p className="font-semibold text-slate-700">
                            No description available.
                        </p>
                    </div>
                    </Overlay>
                </div>
                </div>
            </div>

            
            {/* Back button */}
            <div className="mt-6">
                <Link
                href={`/`}
                className="text-slate-500 text-sm hover:text-slate-700 transition-colors">
                ← Back to home
                </Link>
            </div>

{/*test backend

            <ul>
            {submissions.map((sub) => (
            <li key={sub._id}>
            <strong>Hotel ID:</strong> {sub.hotelId} <br />
            <strong>Status:</strong> {sub.status} <br />
            <strong>Manager:</strong> {sub.manager?.name} ({sub.manager?.email})
            </li>
            ))}
            </ul>
*/}
        </div>
        </main>
    );
    
}