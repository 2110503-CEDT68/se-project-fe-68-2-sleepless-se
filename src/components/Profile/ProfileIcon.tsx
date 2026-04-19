import React from 'react';

interface ProfileIconProps {
  name?: string | null;
  color?: string | null;
  className?: string;
}

export default function ProfileIcon({ 
  name, 
  color, 
  className = "w-9 h-9 text-sm"
}: ProfileIconProps) {
  
  const initial = name && name !== 'No Name Provided' ? name.charAt(0).toUpperCase() : '?';
  const bgColor = color || '#0ea5e9'; 

  return (
    <div 
      style={{ backgroundColor: bgColor }}
      className={`rounded-full flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 ${className}`}
    >
      {initial}
    </div>
  );
}