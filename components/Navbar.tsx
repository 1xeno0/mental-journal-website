"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between p-1.5 bg-white/60 backdrop-blur-xl rounded-full border border-white/40 shadow-lg shadow-sky-500/5 ring-1 ring-white/50 w-full">
        
        <Link href="/" className="ml-2 flex items-center gap-2">
          {/* Replaced Image with text/icon for simplicity if image missing, or keep Image if it works */}
          <div className="relative w-8 h-8">
             <Image 
                src="/logo.png" 
                alt="Serene" 
                fill
                className="object-contain" 
              />
          </div>
          <span className="font-semibold text-slate-700 tracking-tight">Serene</span>
        </Link>

        <div className="flex items-center gap-1.5">
          {pathname === '/' ? (
            <>
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/app" 
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/app" 
                className={`flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-300 ${
                  isActive('/app') 
                    ? 'text-slate-900 bg-white/60 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/40'
                }`}
              >
                Journal
              </Link>
  
              <Link 
                href="/app/insights" 
                className={`flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-300 ${
                  isActive('/app/insights') 
                    ? 'text-slate-900 bg-white/60 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/40'
                }`}
              >
                Insights
              </Link>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
