"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/api';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    // Optimistically clear user state
    setUser(null);
    setLoading(true); // Show loading state or skeleton

    try {
      await logoutUser();
      // Force full reload to ensure auth state is cleared
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: redirect anyway
      window.location.href = "/";
    }
  };

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
          {loading ? (
             <div className="w-24 h-8 animate-pulse bg-slate-200/50 rounded-full" />
          ) : user ? (
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
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-slate-500 hover:text-red-600 bg-transparent hover:bg-red-50 rounded-full transition-all duration-300"
              >
                Log out
              </button>
            </>
          ) : (
            pathname === '/' && (
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
            )
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
