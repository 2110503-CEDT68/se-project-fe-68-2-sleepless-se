"use client";

import React, { useState } from 'react';
import { Button } from '@mui/material';
import { signOut } from 'next-auth/react';

export default function CustomSignOutPage() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: '/' });
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-10 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-sky-900 mb-4">Sign Out</h1>
        <p className="text-slate-500 mb-8">Are you sure you want to sign out from your account?</p>
        
        <Button 
          variant="contained" 
          onClick={handleSignOut}
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-medium transition-colors normal-case text-lg shadow-none"
        >
          {loading ? 'Signing out...' : 'Yes, Sign Out'}
        </Button>

        <button 
          onClick={() => window.history.back()}
          className="mt-4 text-slate-400 hover:text-sky-700 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}