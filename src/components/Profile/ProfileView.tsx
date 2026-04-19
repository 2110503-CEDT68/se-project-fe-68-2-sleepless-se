'use client'

import { signOut } from 'next-auth/react';
<<<<<<< HEAD
import type { ProfileViewProps } from '../../../interface';
=======
import ProfileIcon from './ProfileIcon';

interface ProfileViewProps {
  name: string;
  email: string;
  tel: string;
  color: string;
  onEdit: () => void;
}
>>>>>>> 4d91257336a9ed1d0e17ad90bc434de26365c155

export default function ProfileView({ name, email, tel, color, onEdit }: ProfileViewProps) {
  const displayName = name || 'No Name Provided';
  const initial = displayName !== 'No Name Provided' ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex flex-col items-center space-y-4 mt-8 w-full">
      
      <ProfileIcon 
        name={name} 
        color={color} 
        className="w-24 h-24 text-4xl border-4 border-white ring-1 ring-gray-100" 
      />

      <div className="text-center w-full space-y-1">
        <h3 className="text-xl font-bold text-sky-800">{displayName}</h3>
          <p className="text-sky-700">{email}</p>
          {tel && <p className="text-sky-700 text-sm">📞 {tel}</p>}
      </div>

      <div className="mt-8 w-full pt-6 border-t border-gray-100 space-y-3">
        <button 
          onClick={onEdit}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none transition-colors"
        >
          Edit Profile
        </button>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
