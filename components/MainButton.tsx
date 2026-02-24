'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  href?: string;
  variant?: 'glass' | 'solid';
}

const MainButton: React.FC<MainButtonProps> = ({ 
  children = "Check Your Vibe ✨", 
  href = "/app",
  className = "",
  variant = 'glass',
  onClick,
  ...props 
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (href) router.push(href);
  };

  const baseStyles = "rounded-2xl px-10 py-4 text-lg font-display font-semibold cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out";
  
  const variantStyles = variant === 'glass' 
    ? "glass-card-solid text-foreground" 
    : "bg-slate-900 text-white border border-transparent shadow-lg hover:bg-slate-800";

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`}
      tabIndex={0}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default MainButton;
