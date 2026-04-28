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
  
  const cleanColor = color?.trim();

  let bgColor = '#0ea5e9'; 
  
  if (cleanColor && cleanColor !== "null" && cleanColor !== "undefined") {
    if (cleanColor.length === 6 && !cleanColor.startsWith('#')) {
      bgColor = `#${cleanColor}`;
    } else {
      bgColor = cleanColor;
    }
  } 

  console.log(`ProfileIcon Render -> Name: ${name} | Raw Color Prop:`, color, `| Final bgColor:`, bgColor);

  console.log(initial + " : " + bgColor);

  return (
    <div 
      style={{ backgroundColor: bgColor }}
      className={`rounded-full flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 ${className}`}
    >
      {initial}
    </div>
  );
}