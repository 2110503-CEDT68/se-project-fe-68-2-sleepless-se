'use client'

import { useState } from 'react';
import type { ProfileFormProps, FormErrors } from '../../../interface';
import updateUserProfile from '@/libs/updateUserProfile';

<<<<<<< HEAD
export default function ProfileForm({ initialName, initialTel, token, onSuccess, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({ name: initialName, tel: initialTel });
=======
interface ProfileFormProps {
  initialName: string;
  initialTel: string;
  initialColor: string; 
  token: string;
  onSuccess: (newName: string, newTel: string, newColor: string) => void;
  onCancel: () => void;
}

export default function ProfileForm({ initialName, initialTel, initialColor, token, onSuccess, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({ 
    name: initialName, 
    tel: initialTel, 
    color: initialColor || '#0ea5e9' 
  });
>>>>>>> 4d91257336a9ed1d0e17ad90bc434de26365c155
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.tel.trim()) {
      newErrors.tel = 'Phone number is required';
    } else if (!phoneRegex.test(formData.tel.replace(/[- ]/g, ''))) {
      newErrors.tel = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
<<<<<<< HEAD
      await updateUserProfile(formData.name, formData.tel, token);
      onSuccess(formData.name, formData.tel);
=======
      await updateUserProfile(formData.name, formData.tel, formData.color, token);
      
      onSuccess(formData.name, formData.tel, formData.color);
>>>>>>> 4d91257336a9ed1d0e17ad90bc434de26365c155
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setErrors({ submit: error.message || "Failed to save changes. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 mt-8 flex flex-col items-center">
      {errors.submit && (
        <div className="w-full p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
          {errors.submit}
        </div>
      )}
      
      <div className="w-full">
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

      <div className="w-full">
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

      {/* 5. Added Color Picker Input */}
      <div className="w-full">
        <label htmlFor="color" className="block text-sm font-medium text-sky-900">Profile Color</label>
        <div className="mt-1 flex items-center space-x-3">
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="h-10 w-14 rounded cursor-pointer border border-gray-300 p-0.5"
          />
          <span className="text-sm text-gray-500 font-mono">{formData.color.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex space-x-3 w-full pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
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
  );
}
