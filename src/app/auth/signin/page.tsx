"use client";

import React, { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomSignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const res = await signIn('credentials', {
      redirect: false, 
      email: email,
      password: password,
      callbackUrl: callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setErrorMessage('Invalid email or password. Please try again.');
    } else if (res?.ok) {
      router.push(callbackUrl);
      router.refresh(); 
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex flex-col">
        <h1 className="text-3xl font-bold text-sky-900 mb-2">Sign In</h1>
        <p className="text-slate-500 mb-8">Please enter your details to continue.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <Alert severity="error" className="rounded-xl mb-4">{errorMessage}</Alert>
          )}

          <TextField 
            variant="outlined" 
            label="Email Address" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth 
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <TextField 
            variant="outlined" 
            label="Password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth 
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <Button 
            variant="contained" 
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-medium transition-colors normal-case text-lg shadow-none"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </main>
  );
}