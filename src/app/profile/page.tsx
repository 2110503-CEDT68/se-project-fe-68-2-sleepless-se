'use client'

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import getUserProfile from '@/libs/getUserProfile';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [userTel, setUserTel] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.token) {
        try {
          const profileData = await getUserProfile(session.user.token);
          setUserName(profileData.data?.name || profileData.name || '');
          setUserTel(profileData.data?.tel || profileData.tel || '');
          setUserEmail(profileData.data?.email || session.user?.email || '');
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };
    
    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    router.push('/api/auth/signin');
    return null; 
  }

  const displayName = userName || session.user?.name || 'No Name Provided';
  const initial = displayName !== 'No Name Provided' ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 h-fit">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-sky-900">Your Profile</h2>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-8">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-4xl font-bold shadow-sm border-4 border-white ring-1 ring-gray-100">
            {initial}
          </div>

          {/* User Details */}
          <div className="text-center w-full space-y-1">
            <h3 className="text-xl font-bold text-sky-800">
              {displayName}
            </h3>
            <p className="text-sky-700">
              {userEmail || session.user?.email}
            </p>
            {userTel && (
              <p className="text-sky-700 text-sm">
                📞 {userTel}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
          {/* <button 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Edit Profile
          </button> */}
          
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}