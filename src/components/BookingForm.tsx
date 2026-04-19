"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import createBooking from '@/libs/createBooking';
import getHotels from '@/libs/getHotels';
import getUserProfile from '@/libs/getUserProfile';
import SignInPrompt from './SignInPrompt';

import ProfileIcon from './Profile/ProfileIcon';

interface BookingFormProps {
  initialHotelId: string;
}

export default function BookingForm({ initialHotelId }: BookingFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [hotelId, setHotelId] = useState(initialHotelId);
  const [hotels, setHotels] = useState<any[]>([]);
  const [checkIn, setCheckIn] = useState('');
  const [nights, setNights] = useState(1);
  const [userName, setUserName] = useState('');
  const [userTel, setUserTel] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userColor, setUserColor] = useState('#0ea5e9');

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.token) {
        try {
          const profileData = await getUserProfile(session.user.token);
          setUserName(profileData.data?.name || profileData.name || '');
          setUserTel(profileData.data?.tel || profileData.tel || '');
          setUserEmail(profileData.data?.email || session.user?.email || '');
          setUserColor(profileData.data?.profileImageUrl || '#0ea5e9');
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };
    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  useEffect(() => {
    const fetchHotelsData = async () => {
      try {
        const data = await getHotels();
        setHotels(data);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      }
    };
    fetchHotelsData();
  }, []);

  useEffect(() => {
    if (initialHotelId) setHotelId(initialHotelId);
  }, [initialHotelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId || !checkIn || !nights) {
      alert("Please fill all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createBooking(hotelId, checkIn, nights, session!.user.token);
      alert("Booking Successful!");
      router.push('/cart');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <SignInPrompt />;
  }

  const avatarLetter = userName?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-10 text-center">
          <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Reserve Your Stay</p>
          <h1 className="text-4xl font-extrabold text-slate-800">Hotel Booking</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ===== LEFT: User Profile Card ===== */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Profile */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Gradient Banner */}
              <div className="h-20 bg-gradient-to-r from-sky-400 to-indigo-500" />

              <div className="px-6 pb-6 -mt-10">
                {/* Avatar */}
                <ProfileIcon 
                  name={userName}
                  color={userColor}
                  className="w-24 h-24 text-4xl border-4 border-white ring-1 ring-gray-100" 
                />

                <h2 className="text-xl font-bold text-slate-800 mb-1">{userName || '—'}</h2>
                <p className="text-sm text-slate-400 mb-5">Registered Guest</p>

                <div className="space-y-3">
                  <ProfileRow icon="✉️" label="Email" value={userEmail || session?.user?.email || '—'} />
                  <ProfileRow icon="📞" label="Phone" value={userTel || '—'} />
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
              <p className="text-sky-700 font-semibold text-sm mb-2">📋 Booking Policy</p>
              <ul className="text-sky-600 text-xs space-y-1.5">
                <li>• Maximum stay: <strong>3 nights</strong></li>
                <li>• Check-in after 2:00 PM</li>
                <li>• Free cancellation before check-in</li>
              </ul>
            </div>
          </div>

          {/* ===== RIGHT: Booking Form ===== */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Reservation Details</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Select Hotel */}
              <FormGroup label="Select Hotel" required>
                <select
                  value={hotelId}
                  onChange={(e) => setHotelId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                >
                  <option value="" disabled>— Choose a hotel —</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hotel_name}
                    </option>
                  ))}
                </select>
              </FormGroup>

              {/* Check-in Date */}
              <FormGroup label="Check-in Date" required>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                />
              </FormGroup>

              {/* Number of Nights */}
              <FormGroup label="Number of Nights" required>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNights(Math.max(1, nights - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold text-lg">
                    {nights}
                  </div>
                  <button
                    type="button"
                    onClick={() => setNights(Math.min(3, nights + 1))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Maximum 3 nights per booking</p>
              </FormGroup>

              {/* Summary */}
              {hotelId && checkIn && (
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm">
                  <p className="text-sky-700 font-semibold mb-1">Booking Summary</p>
                  <p className="text-sky-600">
                    {hotels.find(h => h.id === hotelId)?.hotel_name || '—'} · {nights} night{nights > 1 ? 's' : ''} · Check-in: {checkIn}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md text-sm tracking-wide"
              >
                {isSubmitting ? 'Processing...' : 'CONFIRM HOTEL BOOKING'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────

function ProfileRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function FormGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-600">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}
