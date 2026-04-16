"use client";

import { useRouter } from 'next/navigation';

export default function SignInPrompt() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 px-10 py-14 flex flex-col items-center text-center max-w-md w-full">

        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-sky-50 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          {/* decorative ring */}
          <div className="absolute inset-0 rounded-full border-2 border-sky-100 scale-110 opacity-60" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-extrabold text-slate-800 mb-3">
          Sign In to Book
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-xs">
          You must be signed in to reserve a hotel room. Do you already have an account?
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => router.push('/auth/signin')}
            className="flex-1 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
          >
            YES, SIGN IN
          </button>
          <button
            onClick={() => router.push('/register')}
            className="flex-1 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all border border-slate-200 hover:border-sky-300 hover:text-sky-600 text-sm"
          >
            NO, CREATE ACCOUNT
          </button>
        </div>

      </div>
    </div>
  );
}
