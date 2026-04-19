"use client"; 

import React from 'react';
import TopMenuItem from './TopMenuItem';
import { useSession } from 'next-auth/react'; 
import Link from 'next/link'; 

export default function TopMenu() { 
  const { data: session, status } = useSession();

  return (
    <div className="h-20 bg-white/90 backdrop-blur-md text-slate-800 fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 shadow-sm border-b border-slate-200 transition-all">
      
      {/**left side */}
      <div className="flex items-center space-x-10">
          <img 
            src="/img/logo.png" 
            className="h-10 w-auto object-contain rounded-md" 
            alt="logo" 
          />

        
        
        <nav className="hidden md:flex items-center space-x-8 text-base font-medium text-slate-700">
          <TopMenuItem title="Home" pageRef="/" />
          <TopMenuItem title="Book" pageRef="/booking" />
          {session && (
          <TopMenuItem 
            title={session.user?.role === "admin" ? "Bookings" : "My Bookings"} 
            pageRef="/cart" 
          />
          )}
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        {status === "authenticated" && session ? (
          <div className="flex items-center space-x-5">
            {session.user?.name && (
              <Link href="/profile">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold shadow-sm">
                    {session.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                    {session.user.name}
                  </span>
                </div>
              </Link>
            )}
            
            <Link 
              href="/auth/signout" 
              className="text-sm font-medium text-rose-600 hover:text-white hover:bg-rose-500 px-5 py-2.5 rounded-full transition-all border border-rose-200 hover:border-transparent shadow-sm"
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link 
              href="/auth/signin" 
              className="text-sm font-semibold text-slate-600 hover:text-sky-600 px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
      
    </div>
  );
}