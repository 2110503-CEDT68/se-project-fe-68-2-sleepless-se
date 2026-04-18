'use client'

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import getUserProfile from '@/libs/getUserProfile';
import { FormErrors } from '../../../interface';
import updateProfile from '@/libs/updateProfile';

export default function ProfilePage() {
  const { data: session, status, update} = useSession();
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [userTel, setUserTel] = useState('');
  const [userEmail, setUserEmail] = useState('');


  //edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', tel: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.token) {
        try {
          const profileData = await getUserProfile(session.user.token);
          const name = profileData.data?.name || profileData.name || '';
          const tel = profileData.data?.tel || profileData.tel || '';
          const email = profileData.data?.email || session.user?.email || '';
          
          setUserName(name);
          setUserTel(tel);
          setUserEmail(email);
          
          // Pre-fill form data for edit mode
          setFormData({ name, tel });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };
    
    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  const validateForm = () => {
  // Explicitly type this local object
  const newErrors: FormErrors = {};
  
  // Name Validation
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  } else if (formData.name.length < 2) {
    newErrors.name = 'Name must be at least 2 characters';
  }

  // Telephone Validation
  const phoneRegex = /^[0-9]{10}$/; 
  if (!formData.tel.trim()) {
    newErrors.tel = 'Phone number is required';
  } else if (!phoneRegex.test(formData.tel.replace(/[- ]/g, ''))) {
    newErrors.tel = 'Please enter a valid 10-digit phone number';
  }

  setErrors(newErrors);
  
  // Returns true if there are no errors
  return Object.keys(newErrors).length === 0;
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  
  // Clear error for this specific field as the user types
  if (errors[name as keyof FormErrors]) {
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Run validation
    if (!validateForm()) return;

    if (!session?.user?.token) {
      setErrors({ submit: "Authentication token missing. Please sign in again." });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(formData.name, formData.tel, session.user.token);

      setUserName(formData.name);
      setUserTel(formData.tel);
      setIsEditing(false);

      await update({ name: formData.name });

    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrors({ submit: "Failed to save changes. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert form data back to current display states and close
    setFormData({ name: userName, tel: userTel });
    setErrors({});
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

  const displayName = userName || session.user?.name || 'No Name Provided';
  const initial = displayName !== 'No Name Provided' ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 h-fit">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-sky-900">
            {isEditing ? 'Edit Profile' : 'Your Profile'}
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-8">
          <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-4xl font-bold shadow-sm border-4 border-white ring-1 ring-gray-100">
            {initial}
          </div>

          {!isEditing ? (
            // VIEW MODE
            <div className="text-center w-full space-y-1">
              <h3 className="text-xl font-bold text-sky-800">{displayName}</h3>
              <p className="text-sky-700">{userEmail}</p>
              {userTel && <p className="text-sky-700 text-sm">📞 {userTel}</p>}
            </div>
          ) : (
            // EDIT MODE
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {errors.submit && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                  {errors.submit}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-sky-900">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="tel" className="block text-sm font-medium text-sky-900">Phone Number</label>
                <input
                  type="tel"
                  id="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.tel ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.tel && <p className="mt-1 text-sm text-red-600">{errors.tel}</p>}
              </div>

              {/* Note: Email is intentionally left out of the edit form. Changing emails usually requires re-verification for security. */}

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </div>

        {!isEditing && (
          // Action Buttons (Only show in view mode)
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
            <button 
              onClick={() => setIsEditing(true)}
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
        )}

      </div>
    </div>
  );
}