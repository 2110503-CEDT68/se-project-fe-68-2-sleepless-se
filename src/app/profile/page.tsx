'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import getUserProfile from '@/libs/getUserProfile';
import ProfileView from '@/components/Profile/ProfileView';
import ProfileForm from '@/components/Profile/ProfileForm';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Master State
  const [userName, setUserName] = useState('');
  const [userTel, setUserTel] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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

  // Callback for when the form successfully saves
  const handleUpdateSuccess = (newName: string, newTel: string) => {
    setUserName(newName);
    setUserTel(newTel);
    setIsEditing(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 h-fit">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-sky-900">
            {isEditing ? 'Edit Profile' : 'Your Profile'}
          </h2>
        </div>

        {isEditing ? (
          <ProfileForm 
            initialName={userName} 
            initialTel={userTel} 
            token={session.user.token}
            onSuccess={handleUpdateSuccess} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <ProfileView 
            name={userName} 
            email={userEmail} 
            tel={userTel} 
            onEdit={() => setIsEditing(true)} 
          />
        )}

      </div>
    </div>
  );
}