"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import getHotelSubmissions from "@/libs/getHotelSubmissions";
import approveHotelSubmission from "@/libs/approveHotelSubmission";
import rejectHotelSubmission from "@/libs/rejectHotelSubmission";

interface OverlayProps {
  isOpen: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  children: React.ReactNode;
}

interface Manager {
  name: string;
  email: string;
}

interface HotelData {
  hotel_name: string;
  address?: string;
  telephone?: string;
  email?: string;
  description?: string;
  imageUrl?: string;
}

interface HotelSubmission {
  _id: string;
  hotelId?: string;
  status: string;
  manager?: Manager;
  hotelData: HotelData;
}

const Overlay: React.FC<OverlayProps> = ({ 
  isOpen, 
  isProcessing, 
  onClose, 
  onApprove, 
  onReject, 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyles} onClick={!isProcessing ? onClose : undefined}>
      <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
        {children}<br/>
        <div className="flex space-x-3 w-full md:w-auto ml-auto mt-4">
          <button 
            onClick={onReject} 
            disabled={isProcessing}
            className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm text-white ${
              isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Reject'}
          </button>
          <button 
            onClick={onApprove} 
            disabled={isProcessing}
            className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm text-white ${
              isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-amber-600'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Approve'}
          </button>
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
  padding: '24px',
  borderRadius: '12px',
  minWidth: '350px',
  maxWidth: '500px',
  width: '90%',
};

export default function HotelSubmissionPage() {
  const { data: session } = useSession(); 

  const [selectedSubmission, setSelectedSubmission] = useState<HotelSubmission | null>(null);
  const [submissions, setSubmissions] = useState<HotelSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // Prevents spam clicking

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const token = (session as any)?.user?.token || localStorage.getItem('token'); 
        
        // Pass "PENDING" to the fetcher!
        const result = await getHotelSubmissions(token, 'PENDING');
        
        if (result.success) {
          setSubmissions(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [session]);

  const handleApprove = async () => {
    if (!selectedSubmission) return;
    setIsProcessing(true);
    
    try {
      const token = (session as any)?.user?.token || localStorage.getItem('token'); 
      await approveHotelSubmission(selectedSubmission._id, token);
      
      // Remove approved item from list and close modal
      setSubmissions(prev => prev.filter(sub => sub._id !== selectedSubmission._id));
      setSelectedSubmission(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve submission');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;
    
    // Prompt the admin for a required rejection reason
    const reason = window.prompt("Please enter a reason for rejecting this submission:");
    if (!reason) {
      return; // Stop execution if they click cancel or submit an empty string
    }

    setIsProcessing(true);
    
    try {
      const token = (session as any)?.user?.token || localStorage.getItem('token'); 
      await rejectHotelSubmission(selectedSubmission._id, reason, token);
      
      // Remove rejected item from list and close modal
      setSubmissions(prev => prev.filter(sub => sub._id !== selectedSubmission._id));
      setSelectedSubmission(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject submission');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading submissions...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return(
    <main className="min-h-screen bg-slate-100 pt-28 pb-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
              Hotel Edit Submissions
            </h1>
          </div>
        </div>

        {/* List of Submissions */}
        <div className="flex flex-col gap-3">
          {submissions.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No pending submissions found.</p>
          ) : (
            submissions.map((submission) => (
              <div 
                key={submission._id} 
                className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xl font-bold text-slate-800">
                    {submission.hotelData.hotel_name || "Unnamed Hotel"}
                  </p>
                  <p className="text-slate-500 text-sm italic">
                    Manager: {submission.manager?.name || "Unknown"}
                  </p>
                </div>

                <div className="flex w-full md:w-auto ml-auto">
                  <button 
                    onClick={() => setSelectedSubmission(submission)} 
                    className="w-full md:w-auto bg-sky-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back button */}
        <div className="mt-6">
          <Link href={`/`} className="text-slate-500 text-sm hover:text-slate-700 transition-colors">
            ← Back to home
          </Link>
        </div>

        <Overlay 
          isOpen={!!selectedSubmission} 
          isProcessing={isProcessing}
          onClose={() => setSelectedSubmission(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        >
          {selectedSubmission && (
            <div className="flex flex-col gap-3">
              {/* Optional Image */}
              {selectedSubmission.hotelData.imageUrl ? (
                 <img 
                   src={selectedSubmission.hotelData.imageUrl} 
                   alt="Hotel" 
                   className="w-full h-40 object-cover rounded-lg mb-2" 
                 />
              ) : (
                <div className="w-full h-40 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 mb-2">
                  No Image Available
                </div>
              )}
              
              <p className="text-xl font-bold text-slate-800">
                {selectedSubmission.hotelData.hotel_name}
              </p>
              <p className="font-medium text-slate-700">
                📍 {selectedSubmission.hotelData.address || "No address provided"}
              </p>
              <p className="font-medium text-slate-700">
                📞 {selectedSubmission.hotelData.telephone || "No phone provided"}
              </p>
              <p className="font-medium text-slate-700">
                ✉️ {selectedSubmission.hotelData.email || "No email provided"}
              </p>
              <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                {selectedSubmission.hotelData.description || "No description available."}
              </div>
            </div>
          )}
        </Overlay>

      </div>
    </main>
  );
}